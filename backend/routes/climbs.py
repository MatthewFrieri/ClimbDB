import os
import shutil
from pathlib import Path
from uuid import uuid4

import ffmpeg
from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from sqlalchemy import or_
from sqlmodel import select

from helpers.auth import require_login
from const import THUMBNAILS_DIR, UPLOADS_DIR, Color, Grade, Opinion, Style, Wall
from helpers.database import SessionDep
from models import Climb, Filter, Revision

router = APIRouter(prefix="/climbs", tags=["climbs"])


@router.post("/add", dependencies=[Depends(require_login)])
def add_climb(
    session: SessionDep,
    date: str = Form(...),
    media: UploadFile = File(...),
    grade: Grade = Form(...),
    opinion: Opinion = Form(...),
    color: Color = Form(...),
    wall: Wall = Form(...),
    styles: list[Style] = Form(...),
    complete: bool = Form(...),
    flash: bool = Form(...),
    favorite: bool = Form(...),
):
    is_video = media.content_type.startswith("video/")
    is_image = media.content_type.startswith("image/")
    if not (is_video or is_image):
        raise HTTPException(status_code=400, detail="Only images or videos are allowed")

    uuid = uuid4()
    extension = Path(media.filename).suffix
    file_path = UPLOADS_DIR / f"{uuid}{extension}"

    # Save file
    with file_path.open("wb") as buffer:
        shutil.copyfileobj(media.file, buffer)

    # Save thumbnail
    if is_video:
        thumbnail_path = THUMBNAILS_DIR / f"{uuid}.jpg"

        probe = ffmpeg.probe(str(file_path))
        duration = float(probe["format"]["duration"])
        midpoint = duration / 2
        (
            ffmpeg
            .input(str(file_path), ss=midpoint)
            .output(str(thumbnail_path), vframes=1)
            .run()
        )

    climb = Climb.model_validate(
        {
            "date": date,
            "media_url": str(file_path),
            "thumbnail_url": str(thumbnail_path) if is_video else None,
            "is_video": is_video,
            "grade": grade,
            "opinion": opinion,
            "color": color,
            "wall": wall,
            "styles": styles,
            "complete": complete,
            "flash": flash,
            "favorite": favorite,
        }
    )
    session.add(climb)
    session.commit()
    session.refresh(climb)
    return climb


@router.get("/all")
def get_climbs(session: SessionDep):
    climbs = session.exec(select(Climb)).all()
    return climbs


@router.get("/{climb_id}")
def get_climb(session: SessionDep, climb_id: int):
    climb = session.get(Climb, climb_id)

    if not climb:
        raise HTTPException(status_code=404, detail="Climb not found")

    return climb


@router.post("/filter")
def filter_climbs(session: SessionDep, filter: Filter):
    query = select(Climb)

    bool_mappings = {
        Climb.is_video: filter.video,
        Climb.complete: filter.complete,
        Climb.flash: filter.flash,
        Climb.favorite: filter.favorite,
    }
    list_mappings = {
        Climb.grade: filter.grades,
        Climb.opinion: filter.opinions,
        Climb.color: filter.colors,
        Climb.wall: filter.walls,
    }

    for col, val in bool_mappings.items():
        if val is not None:
            query = query.where(col == val)

    for col, val in list_mappings.items():
        if len(val) > 0:
            query = query.where(col.in_(val))

    if len(filter.styles) > 0:
        query = query.where(or_(*[Climb.styles.like(f'%"{style.value}"%') for style in filter.styles]))

    return session.exec(query).all()


@router.patch("/{climb_id}", dependencies=[Depends(require_login)])
def edit_climb(
    session: SessionDep,
    climb_id: int,
    revision: Revision,
):
    climb = session.get(Climb, climb_id)
    if not climb:
        raise HTTPException(status_code=404, detail="Climb not found")

    climb.complete = revision.complete
    climb.flash = revision.flash
    climb.favorite = revision.favorite
    climb.grade = revision.grade
    climb.opinion = revision.opinion
    climb.color = revision.color
    climb.wall = revision.wall
    climb.styles = revision.styles

    session.add(climb)
    session.commit()
    session.refresh(climb)

    return climb


@router.delete("/{climb_id}", dependencies=[Depends(require_login)])
def delete_climb(
    session: SessionDep,
    climb_id: int,
):
    climb = session.get(Climb, climb_id)

    if not climb:
        raise HTTPException(status_code=404, detail="Climb not found")

    session.delete(climb)
    session.commit()

    try:
        media_path = climb.media_url
        if media_path and os.path.exists(media_path):
            os.remove(media_path)
        thumbnail_path = climb.thumbnail_url
        if thumbnail_path and os.path.exists(thumbnail_path):
            os.remove(thumbnail_path)
    except OSError as e:
        print(f"Failed to delete media file {media_path}: {e}")

import os
from collections import defaultdict
from datetime import date, timedelta
from typing import Annotated, Optional
from fastapi import FastAPI, Response, UploadFile, HTTPException, Depends, Cookie, File, Form 
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy import or_
from sqlmodel import Session, SQLModel, create_engine, select
import shutil
from pathlib import Path
import ffmpeg
from uuid import uuid4

from browser_session import BrowserSessionManager
from models import Climb, Filter, Revision
from const import DATA_DIR, DATABASE_URL, DOMAIN, FRONTEND_URL, SESSION_DURATION_HOURS, THUMBNAILS_DIR, UPLOADS_DIR, Grade, Opinion, Style, Color, Wall

# SETUP

engine = create_engine(DATABASE_URL, echo=True)

def get_session():
    with Session(engine) as session:
        yield session

SessionDep = Annotated[Session, Depends(get_session)]
app = FastAPI()
browser_session_manager = BrowserSessionManager(
    session_duration_hours=SESSION_DURATION_HOURS
)

origins = [FRONTEND_URL]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOADS_DIR.mkdir(exist_ok=True)
THUMBNAILS_DIR.mkdir(exist_ok=True)
app.mount("/data", StaticFiles(directory=DATA_DIR), name="data")

# ENDPOINTS

@app.on_event("startup")
def on_startup():
    SQLModel.metadata.create_all(engine)

@app.post("/login")
def login(
    response: Response,
    username: str = Form(...),
    password: str = Form(...),
):
    new_session = browser_session_manager.validate_user_pass(username, password)
    if new_session is None:
        raise HTTPException(status_code=401, detail="Invalid login credentials")
    
    response.set_cookie(
        key="session_id",
        value=new_session.session_id,
        expires=new_session.expires_at,
        domain=DOMAIN,
        httponly=True,
        secure=True,
        samesite="lax",
    )
    return {"message": "Login successful"}

@app.post("/add_climb")
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
    session_id: Optional[str] = Cookie(default=None),
):

    if session_id is None or not browser_session_manager.validate_session_id(session_id):
        raise HTTPException(status_code=401, detail="Unauthorized, no session cookie")

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


@app.get("/all_climbs")
def all_climbs(session: SessionDep):
    climbs = session.exec(select(Climb)).all()
    return climbs


@app.post("/filtered_climbs")
def filtered_climbs(session: SessionDep, filter: Filter):
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


@app.patch("/edit_climb/{climb_id}")
def edit_climb(
    session: SessionDep,
    climb_id: int,
    revision: Revision,
    session_id: Optional[str] = Cookie(default=None),
):
    
    if session_id is None or not browser_session_manager.validate_session_id(session_id):
        raise HTTPException(status_code=401, detail="Unauthorized, no session cookie")
    
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


@app.delete("/delete_climb/{climb_id}")
def delete_climb(
    session: SessionDep,
    climb_id: int,
    session_id: Optional[str] = Cookie(default=None),
):
    
    if session_id is None or not browser_session_manager.validate_session_id(session_id):
        raise HTTPException(status_code=401, detail="Unauthorized, no session cookie")
    
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


@app.post("/charts/date_heatmap_data")
def date_heatmap_data(session: SessionDep, climb_ids: list[int]):

    today = date.today()
    end_date = today.isoformat()
    start_date = (today - timedelta(days=365)).isoformat()

    dates = session.exec(
        select(Climb.date).where(Climb.id.in_(climb_ids)).where(Climb.date >= start_date).where(Climb.date <= end_date)
    ).all()
    distinct_dates = list(set(dates))

    return {
        "start_date": start_date,
        "end_date": end_date,
        "x_labels": distinct_dates,
        "y_values": [dates.count(d) for d in distinct_dates],
    }


@app.post("/charts/grade_lineplot_data")
def grade_lineplot_data(session: SessionDep, climb_ids: list[int]):

    start_date = date.today() - timedelta(days=365)
    end_date = date.today()

    pairs = session.exec(
        select(Climb.date, Climb.grade)
        .where(Climb.id.in_(climb_ids))
        .where(Climb.date >= start_date)
        .where(Climb.date <= end_date)
    ).all()

    num_days = (end_date - start_date).days + 1
    x_labels = [(start_date + timedelta(days=i)).isoformat() for i in range(num_days)]

    counts_by_grade = defaultdict(lambda: defaultdict(int))
    for d, g in pairs:
        counts_by_grade[g][d] += 1

    lines = []
    if len(pairs) == 0:
        return {
            "start_date": start_date.isoformat(),
            "end_date": end_date.isoformat(),
            "x_labels": x_labels,
            "lines": lines,
        }

    for g in Grade:
        if g not in counts_by_grade.keys():
            continue
        y_values = []
        last_value = 0
        for d_str in x_labels:
            d_obj = date.fromisoformat(d_str)
            if d_obj in counts_by_grade[g]:
                last_value += counts_by_grade[g][d_obj]
            y_values.append(last_value)
        lines.append({"grade": g.value, "y_values": y_values})

    return {
        "start_date": start_date.isoformat(),
        "end_date": end_date.isoformat(),
        "x_labels": x_labels,
        "lines": lines,
    }


@app.post("/charts/grade_histogram_data")
def grade_histogram_data(session: SessionDep, climb_ids: list[int]):

    distinct_grades = list(session.exec(select(Climb.grade).distinct()))
    grades = session.exec(select(Climb.grade).where(Climb.id.in_(climb_ids))).all()

    return {
        "x_labels": [g.value for g in Grade if g in distinct_grades],
        "y_values": [grades.count(g) for g in Grade if g in distinct_grades],
    }


@app.post("/charts/opinion_data")
def opinion_data(session: SessionDep, climb_ids: list[int]):

    opinions = session.exec(select(Climb.opinion).where(Climb.id.in_(climb_ids))).all()

    return {
        "x_labels": [opinion.value.capitalize() for opinion in Opinion],
        "y_values": [opinions.count(opinion) for opinion in Opinion],
    }


@app.post("/charts/color_data")
def color_data(session: SessionDep, climb_ids: list[int]):

    distinct_colors = list(session.exec(select(Climb.color).distinct()))
    colors = session.exec(select(Climb.color).where(Climb.id.in_(climb_ids))).all()

    return {
        "x_labels": [c.value for c in Color if c in distinct_colors],
        "y_values": [colors.count(c) for c in Color if c in distinct_colors],
    }


@app.post("/charts/style_histogram_data")
def style_histogram_data(session: SessionDep, climb_ids: list[int]):

    styles = session.exec(select(Climb.styles).where(Climb.id.in_(climb_ids))).all()
    styles = [i for s in styles for i in s]

    return {
        "x_labels": [style.value.capitalize() for style in Style],
        "y_values": [styles.count(style) for style in Style],
    }


@app.post("/charts/style_radar_data")
def style_histogram_data(session: SessionDep, climb_ids: list[int]):

    styles = session.exec(select(Climb.styles).where(Climb.id.in_(climb_ids))).all()
    styles = [i for s in styles for i in s]

    include = [Style.CRIMPS, Style.SLOPERS, Style.POCKETS, Style.PINCHES, Style.BLOCKS, Style.SIDE_PULLS, Style.JUGS]

    return {
        "x_labels": [style.value.capitalize() for style in include],
        "y_values": [styles.count(style) for style in include],
    }


@app.post("/charts/wall_data")
def wall_data(session: SessionDep, climb_ids: list[int]):

    walls = session.exec(select(Climb.wall).where(Climb.id.in_(climb_ids))).all()

    return {
        "x_labels": [wall.value for wall in Wall],
        "y_values": [walls.count(wall) for wall in Wall],
    }


@app.post("/charts/bool_data")
def bool_data(session: SessionDep, climb_ids: list[int]):

    bool_data = session.exec(select(Climb.complete, Climb.flash, Climb.favorite).where(Climb.id.in_(climb_ids))).all()
    print(
        {
            "complete": sum([x[0] for x in bool_data]),
            "flash": sum([x[1] for x in bool_data]),
            "favorite": sum([x[2] for x in bool_data]),
        }
    )
    return {
        "complete": sum([x[0] for x in bool_data]),
        "flash": sum([x[1] for x in bool_data]),
        "favorite": sum([x[2] for x in bool_data]),
    }

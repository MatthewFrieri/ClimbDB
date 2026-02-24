from typing import Annotated, List, Optional
from fastapi import FastAPI, Depends, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy import or_
from sqlmodel import Session, SQLModel, create_engine, select
import shutil
from pathlib import Path
from uuid import uuid4

from .models import Climb, Filter
from .const import DATABASE_URL, FRONTEND_URL, Grade, Opinion, Style, Color, Wall

engine = create_engine(DATABASE_URL, echo=True)


def get_session():
    with Session(engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_session)]
app = FastAPI()

origins = [FRONTEND_URL]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = Path("data/uploads")
UPLOAD_DIR.mkdir(exist_ok=True)
app.mount("/data/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")


@app.on_event("startup")
def on_startup():
    SQLModel.metadata.create_all(engine)


@app.post("/add_climb")
async def add_climb(
    session: SessionDep,
    date: str = Form(...),
    media: UploadFile = File(...),
    grade: Grade = Form(...),
    opinion: Opinion = Form(...),
    color: Color = Form(...),
    wall: Wall = Form(...),
    styles: List[Style] = Form(...),
    complete: bool = Form(...),
    flash: bool = Form(...),
    favorite: bool = Form(...),
):

    is_video = media.content_type.startswith("video/")
    is_image = media.content_type.startswith("image/")
    if not (is_video or is_image):
        raise HTTPException(status_code=400, detail="Only images or videos are allowed")

    extension = Path(media.filename).suffix
    file_path = UPLOAD_DIR / f"{uuid4()}{extension}"

    # Save file
    with file_path.open("wb") as buffer:
        shutil.copyfileobj(media.file, buffer)

    climb = Climb.model_validate(
        {
            "date": date,
            "media_url": str(file_path),
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
    print(filter)
    print(query)

    return session.exec(query).all()

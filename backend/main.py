from typing import Annotated, List, Optional
from fastapi import FastAPI, Depends, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlmodel import Session, SQLModel, create_engine, select
import shutil
from pathlib import Path
from uuid import uuid4

from .models import Climb, Filter
from .const import Grade, GradeOpinion, Style, Color

DATABASE_URL = "sqlite:///database.db"
engine = create_engine(DATABASE_URL, echo=True)


def get_session():
    with Session(engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_session)]
app = FastAPI()

origins = ["http://localhost:5173"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")


@app.on_event("startup")
def on_startup():
    SQLModel.metadata.create_all(engine)


@app.post("/add_climb")
async def add_climb(
    session: SessionDep,
    date: str = Form(...),
    media: UploadFile = File(...),
    grade: Grade = Form(...),
    grade_opinion: GradeOpinion = Form(...),
    color: Optional[Color] = Form(None),
    styles: List[Style] = Form([]),
    complete: bool = Form(...),
    flash: bool = Form(...),
    outdoor: bool = Form(...),
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
            "grade_opinion": grade_opinion,
            "color": color,
            "styles": styles,
            "complete": complete,
            "flash": flash,
            "outdoor": outdoor,
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

    mapping = {
        Climb.is_video: filter.video,
        Climb.complete: filter.complete,
        Climb.flash: filter.flash,
        Climb.outdoor: filter.outdoor,
        Climb.favorite: filter.favorite,
        Climb.grade: filter.grade,
        Climb.grade_opinion: filter.grade_opinion,
        Climb.color: filter.color,
    }

    for column, value in mapping.items():
        if value is not None:
            query = query.where(column == value)

    if filter.style is not None:
        query = query.where(Climb.styles.contains(filter.style))

    return session.exec(query).all()

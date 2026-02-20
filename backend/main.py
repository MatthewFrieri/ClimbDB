from typing import Annotated, List, Optional
from fastapi import FastAPI, Depends, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, SQLModel, create_engine, select
import shutil
from pathlib import Path
from uuid import uuid4

from .models import Climb
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
    styles: List[Style] = Form(...),
    flash: bool = Form(...),
    outdoor: bool = Form(...),
    favorite: bool = Form(...),
):
    save_dir = Path("C:/Users/matfr/Downloads/climbs")
    save_dir.mkdir(exist_ok=True)

    is_video = media.content_type.startswith("video/")
    is_image = media.content_type.startswith("image/")
    if not (is_video or is_image):
        raise HTTPException(status_code=400, detail="Only images or videos are allowed")

    extension = Path(media.filename).suffix
    file_path = save_dir / f"{uuid4()}{extension}"

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
            "flash": flash,
            "outdoor": outdoor,
            "favorite": favorite,
        }
    )
    session.add(climb)
    session.commit()
    session.refresh(climb)
    return climb


@app.get("/all")
def all(session: SessionDep):
    climbs = session.exec(select(Climb)).all()
    return climbs

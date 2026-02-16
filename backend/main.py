from typing import Annotated
from datetime import date
from sqlmodel import Session, SQLModel, create_engine, select
from fastapi import Depends, FastAPI

from .models import Climb
from .const import Grade, GradeOpinion, Style, Color

DATABASE_URL = "sqlite:///database.db"
engine = create_engine(DATABASE_URL, echo=True)


def get_session():
    with Session(engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_session)]
app = FastAPI()


@app.on_event("startup")
def on_startup():
    SQLModel.metadata.create_all(engine)


@app.post("/add_climb")
def add_climb(session: SessionDep, climb: Climb):
    climb = Climb.model_validate(
        {
            "date": date(2026, 2, 24),
            "media_url": "video_url.mov",
            "grade": Grade.V3,
            "gradeOpinion": GradeOpinion.SOFT,
            "color": Color.BLUE,
            "styles": [Style.BLOCKS, Style.SLAB],
            "flash": False,
            "outdoor": False,
            "favorite": True,
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

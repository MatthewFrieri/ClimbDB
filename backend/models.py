from typing import Optional, List
import datetime
from sqlmodel import SQLModel, Field
from sqlalchemy import Column
from sqlalchemy.types import JSON

from .const import Grade, GradeOpinion, Color, Style


class Climb(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    date: datetime.date = Field(index=True)
    media_url: str = Field()
    is_video: bool = Field(index=True)
    grade: Grade = Field(index=True)
    gradeOpinion: GradeOpinion = Field(index=True)
    color: Optional[Color] = Field(index=True)
    styles: List[Style] = Field(sa_column=Column(JSON))
    flash: bool = Field(index=True)
    outdoor: bool = Field(index=True)
    favorite: bool = Field(index=True)

from typing import Optional, List
import datetime
from pydantic import BaseModel
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
    grade_opinion: GradeOpinion = Field(index=True)
    color: Optional[Color] = Field(index=True)
    styles: List[Style] = Field(sa_column=Column(JSON))
    complete: bool = Field(index=True)
    flash: bool = Field(index=True)
    outdoor: bool = Field(index=True)
    favorite: bool = Field(index=True)


class Filter(BaseModel):
    video: Optional[bool] = None
    complete: Optional[bool] = None
    flash: Optional[bool] = None
    outdoor: Optional[bool] = None
    favorite: Optional[bool] = None
    grade: Optional[Grade] = None
    grade_opinion: Optional[GradeOpinion] = None
    color: Optional[Color] = None
    style: Optional[Style] = None

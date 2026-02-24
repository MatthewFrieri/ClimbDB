from typing import Optional, List
import datetime
from pydantic import BaseModel
from sqlmodel import SQLModel, Field
from sqlalchemy import Column
from sqlalchemy.types import JSON

from .const import Grade, Opinion, Color, Style, Wall


class Climb(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    date: datetime.date = Field(index=True)
    media_url: str = Field()
    is_video: bool = Field(index=True)
    grade: Grade = Field(index=True)
    opinion: Opinion = Field(index=True)
    color: Color = Field(index=True)
    wall: Wall = Field(index=True)
    styles: List[Style] = Field(sa_column=Column(JSON), min_items=1)
    complete: bool = Field(index=True)
    flash: bool = Field(index=True)
    favorite: bool = Field(index=True)


class Filter(BaseModel):
    video: Optional[bool] = None
    complete: Optional[bool] = None
    flash: Optional[bool] = None
    favorite: Optional[bool] = None
    grades: List[Grade] = []
    opinions: List[Opinion] = []
    colors: List[Color] = []
    walls: List[Wall] = []
    styles: List[Style] = []

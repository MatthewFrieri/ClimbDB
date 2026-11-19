from collections import defaultdict
from datetime import date, timedelta

from fastapi import APIRouter
from sqlmodel import select

from const import Color, Grade, Opinion, Style, Wall
from helpers.database import SessionDep
from models import Climb

router = APIRouter(prefix="/charts", tags=["charts"])


@router.post("/date_heatmap_data")
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


@router.post("/grade_lineplot_data")
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


@router.post("/grade_histogram_data")
def grade_histogram_data(session: SessionDep, climb_ids: list[int]):

    distinct_grades = list(session.exec(select(Climb.grade).distinct()))
    grades = session.exec(select(Climb.grade).where(Climb.id.in_(climb_ids))).all()

    return {
        "x_labels": [g.value for g in Grade if g in distinct_grades],
        "y_values": [grades.count(g) for g in Grade if g in distinct_grades],
    }


@router.post("/opinion_data")
def opinion_data(session: SessionDep, climb_ids: list[int]):

    opinions = session.exec(select(Climb.opinion).where(Climb.id.in_(climb_ids))).all()

    return {
        "x_labels": [opinion.value.capitalize() for opinion in Opinion],
        "y_values": [opinions.count(opinion) for opinion in Opinion],
    }


@router.post("/color_data")
def color_data(session: SessionDep, climb_ids: list[int]):

    distinct_colors = list(session.exec(select(Climb.color).distinct()))
    colors = session.exec(select(Climb.color).where(Climb.id.in_(climb_ids))).all()

    return {
        "x_labels": [c.value for c in Color if c in distinct_colors],
        "y_values": [colors.count(c) for c in Color if c in distinct_colors],
    }


@router.post("/style_histogram_data")
def style_histogram_data(session: SessionDep, climb_ids: list[int]):

    styles = session.exec(select(Climb.styles).where(Climb.id.in_(climb_ids))).all()
    styles = [i for s in styles for i in s]

    return {
        "x_labels": [style.value.capitalize() for style in Style],
        "y_values": [styles.count(style) for style in Style],
    }


@router.post("/style_radar_data")
def style_radar_data(session: SessionDep, climb_ids: list[int]):

    styles = session.exec(select(Climb.styles).where(Climb.id.in_(climb_ids))).all()
    styles = [i for s in styles for i in s]

    include = [Style.CRIMPS, Style.SLOPERS, Style.POCKETS, Style.PINCHES, Style.BLOCKS, Style.SIDE_PULLS, Style.JUGS]

    return {
        "x_labels": [style.value.capitalize() for style in include],
        "y_values": [styles.count(style) for style in include],
    }


@router.post("/wall_data")
def wall_data(session: SessionDep, climb_ids: list[int]):

    walls = session.exec(select(Climb.wall).where(Climb.id.in_(climb_ids))).all()

    return {
        "x_labels": [wall.value for wall in Wall],
        "y_values": [walls.count(wall) for wall in Wall],
    }


@router.post("/bool_data")
def bool_data(session: SessionDep, climb_ids: list[int]):

    bool_data = session.exec(select(Climb.complete, Climb.flash, Climb.favorite).where(Climb.id.in_(climb_ids))).all()

    return {
        "complete": sum([x[0] for x in bool_data]),
        "flash": sum([x[1] for x in bool_data]),
        "favorite": sum([x[2] for x in bool_data]),
    }

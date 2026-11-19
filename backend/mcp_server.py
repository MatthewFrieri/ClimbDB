"""Read-only MCP server exposing the endpoints that don't require login.

Mounted into the FastAPI app at /mcp (see main.py). Tools reuse the route
functions directly so the logic lives in one place.
"""

from typing import Any, Callable

from mcp.server.mcpserver import MCPServer
from mcp.server.mcpserver.exceptions import ToolError
from mcp.server.transport_security import TransportSecuritySettings
from mcp.types import ToolAnnotations
from sqlmodel import Session, select

from const import BACKEND_HOST, BACKEND_URL, FRONTEND_URL
from helpers.database import engine
from fastapi import HTTPException

from models import Climb, Filter
from routes import charts, climbs

READ_ONLY = ToolAnnotations(readOnlyHint=True, openWorldHint=False)

mcp = MCPServer(
    name="ClimbDB",
    instructions=(
        "Read-only access to a personal bouldering log. Use get_climbs or filter_climbs to find climbs, "
        "then the *_data tools for chart-style stats. Chart tools take optional climb_ids; omit them to use every climb. "
        f"To link a climb, use its page at {FRONTEND_URL}/gallery/{{id}}, which shows the photo or video and its details."
    ),
)


def _with_full_urls(climb: Climb) -> Climb:
    """Copy of the climb with media/thumbnail paths turned into full URLs."""
    return Climb.model_validate({
        **climb.model_dump(),
        "media_url": f"{BACKEND_URL}/{climb.media_url}",
        "thumbnail_url": f"{BACKEND_URL}/{climb.thumbnail_url}" if climb.thumbnail_url else None,
    })


@mcp.tool(annotations=READ_ONLY)
def get_climbs() -> list[Climb]:
    """List every logged climb."""
    with Session(engine) as session:
        return [_with_full_urls(c) for c in climbs.get_climbs(session)]


@mcp.tool(annotations=READ_ONLY)
def get_climb(climb_id: int) -> Climb:
    """Get a single climb by its id."""
    with Session(engine) as session:
        try:
            return _with_full_urls(climbs.get_climb(session, climb_id))
        except HTTPException as e:
            raise ToolError(f"Climb {climb_id}: {e.detail}")


@mcp.tool(annotations=READ_ONLY)
def filter_climbs(filter: Filter) -> list[Climb]:
    """Find climbs matching a filter. Boolean fields left unset are ignored; list fields match any of the given
    values; an empty list means no restriction. Styles match climbs that have at least one of the given styles."""
    with Session(engine) as session:
        return [_with_full_urls(c) for c in climbs.filter_climbs(session, filter)]


def _chart_tool(fn: Callable, description: str):
    def tool(climb_ids: list[int] | None = None) -> dict[str, Any]:
        with Session(engine) as session:
            ids = climb_ids if climb_ids is not None else list(session.exec(select(Climb.id)).all())
            return fn(session, ids)

    mcp.tool(name=fn.__name__, description=description, annotations=READ_ONLY)(tool)


_chart_tool(charts.date_heatmap_data, "Number of climbs per date over the last 365 days.")
_chart_tool(charts.grade_lineplot_data, "Cumulative climb count per grade for each day over the last 365 days.")
_chart_tool(charts.grade_histogram_data, "Number of climbs per grade.")
_chart_tool(charts.opinion_data, "Number of climbs per opinion (soft / normal / hard for the grade).")
_chart_tool(charts.color_data, "Number of climbs per hold color.")
_chart_tool(charts.style_histogram_data, "Number of climbs per style (a climb can have several styles).")
_chart_tool(charts.wall_data, "Number of climbs per wall.")
_chart_tool(charts.bool_data, "How many climbs are complete, flashed, and favorited.")
# NOTE charts.style_radar_data is omitted since its the same data as charts.style_histogram_data


# Streamable HTTP app with a single route at /mcp
mcp_app = mcp.streamable_http_app(
    streamable_http_path="/mcp",
    stateless_http=True,
    json_response=True,
    transport_security=TransportSecuritySettings(
        allowed_hosts=[BACKEND_HOST, "localhost:*", "127.0.0.1:*"],
        allowed_origins=[FRONTEND_URL, "http://localhost:*", "http://127.0.0.1:*"],
    ),
)

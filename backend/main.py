from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from const import DATA_DIR, FRONTEND_URL, THUMBNAILS_DIR, UPLOADS_DIR
from helpers.database import create_db_and_tables
from mcp_server import mcp, mcp_app
from routes.auth import router as auth_router
from routes.climbs import router as climbs_router
from routes.charts import router as charts_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    async with mcp.session_manager.run():
        yield


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOADS_DIR.mkdir(exist_ok=True)
THUMBNAILS_DIR.mkdir(exist_ok=True)
app.mount("/data", StaticFiles(directory=DATA_DIR), name="data")

app.include_router(auth_router)
app.include_router(climbs_router)
app.include_router(charts_router)

# MCP server at /mcp
app.router.routes.extend(mcp_app.routes)

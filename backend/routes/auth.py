from typing import Optional

from fastapi import APIRouter, Cookie, Form, HTTPException, Response

from helpers.auth import browser_session_manager, is_valid_session
from const import DOMAIN

router = APIRouter(prefix="/login", tags=["login"])


@router.post("")
def login(
    response: Response,
    username: str = Form(...),
    password: str = Form(...),
):
    new_session = browser_session_manager.validate_user_pass(username, password)
    if new_session is None:
        raise HTTPException(status_code=401, detail="Invalid login credentials")

    response.set_cookie(
        key="session_id",
        value=new_session.session_id,
        expires=new_session.expires_at,
        domain=DOMAIN,
        httponly=True,
        secure=True,
        samesite="lax",
    )
    return {"message": "Login successful"}


@router.get("/status")
def get_login_status(
    session_id: Optional[str] = Cookie(default=None),
):
    return {"logged_in": is_valid_session(session_id)}

from typing import Optional

from fastapi import Cookie, HTTPException

from browser_session import BrowserSessionManager
from const import SESSION_DURATION_HOURS

browser_session_manager = BrowserSessionManager(
    session_duration_hours=SESSION_DURATION_HOURS
)


def is_valid_session(session_id: Optional[str]) -> bool:
    return session_id is not None and browser_session_manager.validate_session_id(session_id)


def require_login(session_id: Optional[str] = Cookie(default=None)):
    """Dependency that rejects requests without a valid session cookie."""
    if not is_valid_session(session_id):
        raise HTTPException(status_code=401, detail="Unauthorized, no session cookie")

import os
from uuid import uuid4
from dotenv import load_dotenv
from dataclasses import dataclass
from typing import Optional
from datetime import datetime, timedelta, timezone


@dataclass
class BrowserSession:
    session_id: str
    expires_at: datetime

class BrowserSessionManager:
    def __init__(self, session_duration_hours: int):
        self._active_sessions: list[BrowserSession] = []
        self._session_duration = timedelta(hours=session_duration_hours)

        load_dotenv()
        self._admin_username = os.getenv("ADMIN_USERNAME")
        self._admin_password = os.getenv("ADMIN_PASSWORD")
    
    def _remove_expired_sessions(self) -> list[BrowserSession]:
        self._active_sessions = [s for s in self._active_sessions if s.expires_at > datetime.now(timezone.utc)]

    def validate_user_pass(self, username: str, password: str) -> Optional[BrowserSession]:
        if username == self._admin_username and password == self._admin_password:
            new_session = BrowserSession(
                session_id=uuid4().hex,
                expires_at=datetime.now(timezone.utc) + self._session_duration,
            )
            self._active_sessions.append(new_session)
            return new_session
        return None

    def validate_session_id(self, session_id: str) -> bool:
        self._remove_expired_sessions()
        return session_id in [s.session_id for s in self._active_sessions]
    
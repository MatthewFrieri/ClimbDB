from enum import Enum
from pathlib import Path

DATABASE_URL = "sqlite:///data/database.db"
DATA_DIR = Path("data")
UPLOADS_DIR = DATA_DIR / "uploads"
THUMBNAILS_DIR = DATA_DIR / "thumbnails"

DOMAIN = "frieri.ca"
FRONTEND_URL = "https://climbdb.frieri.ca"
SESSION_DURATION_HOURS = 1 # hours


class Grade(str, Enum):
    UNKNOWN = "V?"
    VB = "VB"
    V0 = "V0"
    V1 = "V1"
    V2 = "V2"
    V3 = "V3"
    V4 = "V4"
    V5 = "V5"
    V6 = "V6"
    V7 = "V7"
    V8 = "V8"
    V9 = "V9"
    V10 = "V10"


class Opinion(str, Enum):
    SOFT = "soft"
    NORMAL = "normal"
    HARD = "hard"


class Color(str, Enum):
    RED = "red"
    ORANGE = "orange"
    YELLOW = "yellow"
    GREEN = "green"
    TEAL = "teal"
    BLUE = "blue"
    PURPLE = "purple"
    PINK = "pink"
    BLACK = "black"
    WHITE = "white"


class Wall(str, Enum):
    ASH = "ash"
    RIDGE = "ridge"
    BIG_SHOW = "big show"
    MOCHA = "mocha"
    HOLLOW = "hollow"
    GROTTO = "grotto"
    PEBBLE = "pebble"
    SUMMIT = "summit"
    ONYX = "onyx"
    PARADISE = "paradise"
    PEANUT = "peanut"
    OTHER = "other"


class Style(str, Enum):
    JUGS = "jugs"
    CRIMPS = "crimps"
    SLOPERS = "slopers"
    POCKETS = "pockets"
    PINCHES = "pinches"
    BLOCKS = "blocks"
    SIDE_PULLS = "side pulls"
    SLAB = "slab"
    TENSION = "tension"
    HEEL_HOOK = "heel hook"
    TOE_HOOK = "toe hook"
    DYNO = "dyno"
    COORDINATION = "coordination"
    COMPRESSION = "compression"
    MANTLE = "mantle"
    KNEE_BAR = "knee bar"
    BAT_HANG = "bat hang"

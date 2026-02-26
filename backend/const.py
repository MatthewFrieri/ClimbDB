from enum import Enum

FRONTEND_URL = "http://localhost:5173"
DATABASE_URL = "sqlite:///data/database.db"


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


GRADE_ORDER = [
    Grade.UNKNOWN,
    Grade.VB,
    Grade.V0,
    Grade.V1,
    Grade.V2,
    Grade.V3,
    Grade.V4,
    Grade.V5,
    Grade.V6,
    Grade.V7,
    Grade.V8,
    Grade.V9,
    Grade.V10,
]


class Opinion(str, Enum):
    SOFT = "soft"
    NORMAL = "normal"
    HARD = "hard"


OPINION_ORDER = [Opinion.SOFT, Opinion.NORMAL, Opinion.HARD]


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


COLOR_ORDER = [
    Color.RED,
    Color.ORANGE,
    Color.YELLOW,
    Color.GREEN,
    Color.TEAL,
    Color.BLUE,
    Color.PURPLE,
    Color.PINK,
    Color.BLACK,
    Color.WHITE,
]


class Wall(str, Enum):
    ASH = "ash"
    PARADISE = "paradise"
    ONYX = "onyx"
    PEANUT = "peanut"
    SUMMIT = "summit"
    RIDGE = "ridge"
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

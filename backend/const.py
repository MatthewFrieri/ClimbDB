from enum import Enum, IntEnum

class Grade(IntEnum):
    UNKNOWN = -2
    VB = -1
    V0 = 0
    V1 = 1
    V2 = 2
    V3 = 3
    V4 = 4
    V5 = 5
    V6 = 6
    V7 = 7
    V8 = 8
    V9 = 9
    V10 = 10

class GradeOpinion(IntEnum):
    SOFT = 0
    NORMAL = 1
    HARD = 2

class Color(str, Enum):
    RED = "#db0202"
    ORANGE = "#eb6405"
    YELLOW = "#f5d400"
    GREEN = "#178000"
    BLUE = "#338ad6"
    PURPLE = "#4c13a1"
    PINK = "#f774e8"
    BLACK = "#242424"

class Style(str, Enum):
    JUGS = "jugs"
    CRIMPS = "crimps"
    SLOPERS = "slopers"
    POCKETS = "pockets"
    PINCHES = "pinches"
    BLOCKS = "blocks"
    DYNO = "dyno"
    COORDINATION = "coordination"
    SLAB = "slab"
    TENSION = "tension"

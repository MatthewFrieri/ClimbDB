from enum import Enum


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


class GradeOpinion(str, Enum):
    SOFT = "soft"
    NORMAL = "normal"
    HARD = "hard"


class Color(str, Enum):
    RED = "red"
    ORANGE = "orange"
    YELLOW = "yellow"
    GREEN = "green"
    BLUE = "blue"
    PURPLE = "purple"
    PINK = "pink"
    BLACK = "black"
    # RED = "#db0202"
    # ORANGE = "#eb6405"
    # YELLOW = "#f5d400"
    # GREEN = "#178000"
    # BLUE = "#338ad6"
    # PURPLE = "#4c13a1"
    # PINK = "#f774e8"
    # BLACK = "#242424"


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

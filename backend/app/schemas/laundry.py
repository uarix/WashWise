from pydantic import BaseModel
from typing import List, Optional

class Machine(BaseModel):
    id: int
    name: str
    deviceErrorCode: int
    deviceErrorMsg: str
    calc_remainTime: int

class Laundry(BaseModel):
    id: int
    name: str
    # Add other fields as needed

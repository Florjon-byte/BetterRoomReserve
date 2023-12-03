from pydantic import BaseModel, EmailStr
from typing import Optional
import uuid

class LogIn(BaseModel):
    username: str
    password: str

class UserModel(BaseModel):
    net_id: str

class Room(BaseModel):
    room_id: str
    building: str

class Filters(BaseModel):
    size: Optional[int] = None
    noise_level: Optional[str] = None
    start_time: Optional[str] = None

class Reservation(BaseModel):
    date: str
    start_time: str
    end_time: str
    room_id: str
    net_id: str

class Survey(BaseModel):
    user_id: str
    room_id: str
    reservation_id: uuid.UUID
    noise_level: int
    working_outlets: bool
    working_monitor: bool
    whiteboards: str
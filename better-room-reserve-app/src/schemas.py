from pydantic import BaseModel, EmailStr
from typing import Optional
import uuid

class LogIn(BaseModel):
    email: EmailStr
    password: str

class UserModel(BaseModel):
    net_id: Optional[str] = None
    email: Optional[EmailStr] = None
    auth_token: Optional[str] = None

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
    email: EmailStr
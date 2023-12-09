from pydantic import BaseModel, EmailStr
from typing import Optional, List
import uuid

class LogIn(BaseModel):
  email: EmailStr
  password: str

class UserModel(BaseModel):
  net_id: Optional[str] = None
  email: Optional[EmailStr] = None
  auth_token: Optional[str] = None

class Filters(BaseModel):
  size: Optional[int] = None
  date: Optional[str] = None
  start_time: Optional[str] = None

class Reservation(BaseModel):
  date: str
  time: List[str]
  room_id: str
  email: EmailStr

class Room(BaseModel):
  room_id: str
  date: Optional[str] = None
  time: Optional[str] = None
  building: Optional[str] = None

class ReservationInfo(BaseModel):
  res_id: uuid.UUID

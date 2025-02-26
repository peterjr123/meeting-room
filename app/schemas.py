from typing import List
from pydantic import BaseModel

# Room

class RoomCreate(BaseModel):
    name: str
    position: str
    details: str

class RoomCreateResponse(RoomCreate):
    id: int

    class Config:
        from_attributes = True


# User
class UserCreate(BaseModel):
    name: str
    department: str
    password: str

class UserCreateResponse(UserCreate):
    id: int


# Common Reservation

class ReservationCommonCreate(BaseModel):
    userId: int
    userName: str
    purpose: str
    details: str
    startTime: str
    endTime: str
    participants: List[str]
    room: str

# Onetime

class OnetimeReservationCreate(ReservationCommonCreate):
    date: str

    class Config:
        from_attributes = True

class OnetimeReservationResponse(OnetimeReservationCreate):
    id: int

    class Config:
        from_attributes = True

# Recurring

class RecurringReservationCreate(ReservationCommonCreate):
    dayInWeek: str

    class Config:
        from_attributes = True

class RecurringReservationResponse(RecurringReservationCreate):
    id: int

    class Config:
        from_attributes = True


# Participant

class ParticipantsCreate(BaseModel):
    # str의 list
    participants : List[str]


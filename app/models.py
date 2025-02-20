from database import Base
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship


class ReservationDB(Base):
    __tablename__ = "reservations"
    id = Column(Integer, primary_key=True, index=True)
    userId = Column(String(50), index=True)
    userName = Column(String(50), index=True)
    purpose = Column(String(50))
    details = Column(String(200))
    date= Column(String(20))
    startTime = Column(String(10))
    endTime = Column(String(10))
    room = Column(String(30), ForeignKey('rooms.name', ondelete='CASCADE', onupdate='CASCADE'))

class RecurringReservationDB(Base):
    __tablename__ = "recurring_reservations"
    id = Column(Integer, primary_key=True, index=True)
    userId = Column(String(50), index=True)
    userName = Column(String(50), index=True)
    purpose = Column(String(50))
    details = Column(String(200))
    startTime = Column(String(10))
    endTime = Column(String(10))
    dayInWeek= Column(String(20))
    room = Column(String(30), ForeignKey('rooms.name', ondelete='CASCADE', onupdate='CASCADE'))

class RoomDB(Base):
    __tablename__ = "rooms"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(30), unique=True, index=True)
    position = Column(String(50))
    details = Column(String(200))
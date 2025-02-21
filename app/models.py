from database import Base
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy import ForeignKey

class CommonReservationDB(Base):
    __tablename__ = "reservation_common"
    id = Column(Integer, primary_key=True, index=True)
    userId = Column(String(50), ForeignKey('users.id', ondelete='CASCADE'), index=True)
    purpose = Column(String(50))
    details = Column(String(200))
    startTime = Column(String(10))
    endTime = Column(String(10))
    room = Column(String(30), ForeignKey('rooms.name', ondelete='CASCADE', onupdate='CASCADE'))

    def __str__(self):
        return f"OnetimeReservationDB(id: {self.id} userId:{self.userId} purpose:{self.purpose})"

class OnetimeReservationDB(Base):
    __tablename__ = "reservations_onetime"
    id = Column(Integer, ForeignKey('reservation_common.id', ondelete='CASCADE'), primary_key=True, index=True)
    date= Column(DateTime)

    def __str__(self):
        return f"OnetimeReservationDB(id: {self.id} date:{self.date})"


class UserDB(Base):
    __tablename__ = "users"
    id = Column(String(50), primary_key=True, index=True)
    name = Column(String(50), unique=True, index=True)


class RecurringReservationDB(Base):
    __tablename__ = "recurring_reservations"
    id = Column(Integer, ForeignKey('reservation_common.id', ondelete='CASCADE'), primary_key=True, index=True)
    dayInWeek= Column(String(20))

class RoomDB(Base):
    __tablename__ = "rooms"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(30), unique=True, index=True)
    position = Column(String(50))
    details = Column(String(200))
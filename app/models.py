from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy import ForeignKey, PrimaryKeyConstraint
from sqlalchemy.ext.declarative import declarative_base

# Base 클래스 생성 (모델에서 상속받을 클래스)
Base = declarative_base()

class CommonReservationDB(Base):
    __tablename__ = "reservations_common"
    id = Column(Integer, primary_key=True, index=True)
    userId = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), index=True)
    purpose = Column(String(50))
    details = Column(String(200))
    startTime = Column(String(10))
    endTime = Column(String(10))
    room = Column(String(30), ForeignKey('rooms.name', ondelete='CASCADE', onupdate='CASCADE'))

    def __str__(self):
        return f"OnetimeReservationDB(id: {self.id} userId:{self.userId} purpose:{self.purpose})"

class OnetimeReservationDB(Base):
    __tablename__ = "reservations_onetime"
    id = Column(Integer, ForeignKey('reservations_common.id', ondelete='CASCADE'), primary_key=True, index=True)
    date= Column(DateTime)

    def __str__(self):
        return f"OnetimeReservationDB(id: {self.id} date:{self.date})"


class UserDB(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, index=True)
    password = Column(String(150))
    department = Column(String(50))


class RecurringReservationDB(Base):
    __tablename__ = "reservations_recurring"
    id = Column(Integer, ForeignKey('reservations_common.id', ondelete='CASCADE'), primary_key=True, index=True)
    dayInWeek= Column(String(20))

class RoomDB(Base):
    __tablename__ = "rooms"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(30), unique=True, index=True)
    position = Column(String(50))
    details = Column(String(200))

class ParticipantDB(Base):
    __tablename__ = "participants"
    id = Column(Integer, ForeignKey('reservations_common.id', ondelete='CASCADE'), index=True)
    name = Column(String(50))

    __table_args__ = (PrimaryKeyConstraint('id', 'name'),)
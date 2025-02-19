from pydantic import BaseModel
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi import FastAPI, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import text
import os
from dotenv import load_dotenv


class ReservationCreate(BaseModel):
    userId: str
    userName: str
    purpose: str
    details: str
    date: str
    startTime: str
    endTime: str
    room: str

class RoomCreate(BaseModel):
    name: str
    position: str
    details: str

class RoomCreateResponse(RoomCreate):
    id: int

    class Config:
        from_attributes = True


class ReservationResponse(ReservationCreate):
    id: int

    class Config:
        from_attributes = True


Base = declarative_base()

class ReservationDB(Base):
    __tablename__ = "reservations"
    id = Column(Integer, primary_key=True, index=True)
    userId = Column(String, index=True)
    userName = Column(String, index=True)
    purpose = Column(String)
    details = Column(String)
    date= Column(String)
    startTime = Column(String)
    endTime = Column(String)
    room = Column(String, ForeignKey('rooms.name', ondelete='CASCADE'))
    rooms = relationship("RoomDB", back_populates="reservation")

class RoomDB(Base):
    __tablename__ = "rooms"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    position = Column(String)
    details = Column(String)
    reservation = relationship("ReservationDB", back_populates="rooms", uselist=True)

load_dotenv()
SQLALCHEMY_DATABASE_URL = os.getenv("SQLALCHEMY_DATABASE_URL")

if not SQLALCHEMY_DATABASE_URL:
    raise ValueError("환경 변수에서 SQLALCHEMY_DATABASE_URL을 찾을 수 없습니다.")

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 데이터베이스 테이블 생성
Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

app = FastAPI()

# 새로운 회의실 생성
@app.post("/rooms/", response_model=RoomCreateResponse)
def create_room(creation: RoomCreate, db: Session = Depends(get_db)):
    # 예약 생성
    db_reservation = RoomDB(**creation.model_dump())
    db.add(db_reservation)
    db.commit()
    db.refresh(db_reservation)
    return db_reservation

# 모든 회의실 조회
@app.get("/rooms/", response_model=list[RoomCreateResponse])
def read_rooms(skip: int = 0, limit: int = 1000, db: Session = Depends(get_db)):
    reservations = db.query(RoomDB).offset(skip).limit(limit).all()
    return reservations

# 회의실 정보 수정
@app.put("/rooms/{room_id}", response_model=RoomCreateResponse)
def update_room(room_id: int, room: RoomCreate, db: Session = Depends(get_db)):
    db_room = db.query(RoomDB).filter(RoomDB.id == room_id).first()
    if db_room is None:
        raise HTTPException(status_code=404, detail="Room not found")
    
    # 먼저 해당 회의실로 예약된 예약 room 업데이트 (cascade가 sqlite에서 제공되지 않음)
    reserved_room = db.query(RoomDB).filter(RoomDB.id == room_id).first()
    db.query(ReservationDB).filter(ReservationDB.room == room.name).update({"room": room.name})

    for key, value in room.model_dump().items():
        setattr(db_room, key, value)
    db.commit()
    db.refresh(db_room)
    return db_room

# 예약 삭제
@app.delete("/rooms/{room_id}", response_model=RoomCreateResponse)
def delete_room(room_id: int, db: Session = Depends(get_db)):
    db_room = db.query(RoomDB).filter(RoomDB.id == room_id).first()
    if db_room is None:
        raise HTTPException(status_code=404, detail="Reservation not found")
    # 먼저 해당 회의실로 예약된 예약 삭제 (cascade가 sqlite에서 제공되지 않음)
    room = db.query(RoomDB).filter(RoomDB.id == room_id).first()
    db.query(ReservationDB).filter(ReservationDB.room == room.name).delete()

    db.delete(db_room)
    db.commit()
    return db_room


# 새로운 예약 생성
@app.post("/reservations/", response_model=ReservationResponse)
def create_reservation(reservation: ReservationCreate, db: Session = Depends(get_db)):
    # foreign key 검사 (sqlite의 경우 foreign key 검사를 하지 않음. 다른 DB를 사용하는 경우 try-catch로 검사할 수 있음)
    if db.query(RoomDB).filter(RoomDB.name == reservation.room).first() is None:
        raise HTTPException(status_code=400, detail="no room exist specified by .room field")
    
    # 중복 검사
    if is_reservation_conflict(db, reservation.date, reservation.startTime, reservation.endTime, reservation.room):
        raise HTTPException(status_code=400, detail="Reservation conflicts with an existing reservation")

    # 예약 생성
    db_reservation = ReservationDB(**reservation.model_dump())
    db.add(db_reservation)
    db.commit()
    db.refresh(db_reservation)
    return db_reservation

# 모든 예약 조회
@app.get("/reservations/", response_model=list[ReservationResponse])
def read_reservations(skip: int = 0, limit: int = 1000, db: Session = Depends(get_db)):
    reservations = db.query(ReservationDB).offset(skip).limit(limit).all()
    return reservations

# 현재 시간 이후의 예약 조회 API
@app.get("/reservations/upcoming", response_model=list[ReservationResponse])
def get_upcoming_reservations(
    base_time: str = Query(..., description="기준 시간 (HH:MM)"),
    base_date: str = Query(..., description="기준 날짜 (YYYY-MM-DD)"),
    db: Session = Depends(get_db)
):
    # 날짜가 base_date 이후이거나, 같은 날짜에서 base_time 이후인 예약 조회
    upcoming_reservations = db.query(ReservationDB).filter(
        or_(
            ReservationDB.date > base_date,  # 날짜가 base_date 이후
            and_(
                ReservationDB.date == base_date,  # 같은 날짜
                ReservationDB.endTime >= base_time  # base_time 이후
            )
        )
    ).all()

    return upcoming_reservations


# 특정 예약 조회
@app.get("/reservations/{reservation_id}", response_model=ReservationResponse)
def read_reservation(reservation_id: int, db: Session = Depends(get_db)):
    reservation = db.query(ReservationDB).filter(ReservationDB.id == reservation_id).first()
    if reservation is None:
        raise HTTPException(status_code=404, detail="Reservation not found")
    return reservation

# 예약 수정
@app.put("/reservations/{reservation_id}", response_model=ReservationResponse)
def update_reservation(reservation_id: int, reservation: ReservationCreate, db: Session = Depends(get_db)):
    db_reservation = db.query(ReservationDB).filter(ReservationDB.id == reservation_id).first()
    if db_reservation is None:
        raise HTTPException(status_code=404, detail="Reservation not found")
    for key, value in reservation.model_dump().items():
        setattr(db_reservation, key, value)
    db.commit()
    db.refresh(db_reservation)
    return db_reservation

# 예약 삭제
@app.delete("/reservations/{reservation_id}", response_model=ReservationResponse)
def delete_reservation(reservation_id: int, db: Session = Depends(get_db)):
    db_reservation = db.query(ReservationDB).filter(ReservationDB.id == reservation_id).first()
    if db_reservation is None:
        raise HTTPException(status_code=404, detail="Reservation not found")
    db.delete(db_reservation)
    db.commit()
    return db_reservation



# utility functions

def is_reservation_conflict(db: Session, date: str, startTime: str, endTime: str, room: str, reservation_id: int = None):
    # 동일한 날짜와 회의실에서 시간대가 겹치는 예약이 있는지 확인
    conflicting_reservations = db.query(ReservationDB).filter(
        and_(
            ReservationDB.room == room,  # 같은 회의실
            ReservationDB.date == date,  # 같은 날짜
            or_(
                and_(ReservationDB.startTime <= startTime, ReservationDB.endTime >= startTime), 
                and_(ReservationDB.startTime <= endTime, ReservationDB.endTime >= endTime),  
                and_(ReservationDB.startTime >= startTime, ReservationDB.endTime <= endTime)
            )
        )
    )

    # 수정 시 현재 예약은 제외
    if reservation_id:
        conflicting_reservations = conflicting_reservations.filter(ReservationDB.id != reservation_id)

    return conflicting_reservations.first() is not None
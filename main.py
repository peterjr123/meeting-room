from pydantic import BaseModel
from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi import FastAPI, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_

class ReservationCreate(BaseModel):
    userId: str
    userName: str
    purpose: str
    details: str
    date: str
    startTime: str
    endTime: str
    room: str

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
    room = Column(String)


SQLALCHEMY_DATABASE_URL = "sqlite:///./reservations.db"
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

# 새로운 예약 생성
@app.post("/reservations/", response_model=ReservationResponse)
def create_reservation(reservation: ReservationCreate, db: Session = Depends(get_db)):
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




@app.on_event("startup")
def startup_event():
    db = SessionLocal()
    try:
        # 초기 데이터 삽입
        test_data = [
            ReservationDB(
                userId='1',
                userName="joon",
                purpose="Meeting",
                details="Project discussion",
                date="2025-02-13",
                startTime="10:00",
                endTime="11:00",
                room="room1",
            ),
            ReservationDB(
                userId='2',
                userName="alice",
                purpose="Workshop",
                details="Team building",
                date="2025-02-13",
                startTime="14:00",
                endTime="16:00",
                room="room2",
            ),
        ]
        for data in test_data:
            db.merge(data)
        db.commit()
    finally:
        db.close()


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
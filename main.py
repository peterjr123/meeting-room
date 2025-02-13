from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from datetime import datetime

# SQLite 데이터베이스 설정
SQLALCHEMY_DATABASE_URL = "sqlite:///./reservations.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# 데이터베이스 모델 정의
class ReservationDB(Base):
    __tablename__ = "reservations"
    id = Column(Integer, primary_key=True, index=True)
    date = Column(String, index=True)
    user = Column(String, index=True)
    text = Column(String)
    startTime = Column(String)
    endTime = Column(String)
    room = Column(String)

# 데이터베이스 테이블 생성
Base.metadata.create_all(bind=engine)

# Pydantic 모델 정의 (API 요청 및 응답 스키마)
class ReservationCreate(BaseModel):
    date: str
    user: str
    text: str
    startTime: str
    endTime: str
    room: str

class ReservationResponse(ReservationCreate):
    id: int

    class Config:
        from_attributes = True

# FastAPI 애플리케이션 생성
app = FastAPI()

# CORS 처리
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 모든 도메인 허용 (개발용)
    allow_credentials=True,
    allow_methods=["*"],  # 모든 HTTP 메서드 허용
    allow_headers=["*"],  # 모든 헤더 허용
)

# 데이터베이스 세션 의존성
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# CRUD API
@app.post("/reservations/", response_model=ReservationResponse)
def create_reservation(reservation: ReservationCreate, db: Session = Depends(get_db)):
    db_reservation = ReservationDB(**reservation.model_dump())
    db.add(db_reservation)
    db.commit()
    db.refresh(db_reservation)
    return db_reservation

@app.get("/reservations/", response_model=list[ReservationResponse])
def read_reservations(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    reservations = db.query(ReservationDB).offset(skip).limit(limit).all()
    return reservations

@app.get("/reservations/{reservation_id}", response_model=ReservationResponse)
def read_reservation(reservation_id: int, db: Session = Depends(get_db)):
    reservation = db.query(ReservationDB).filter(ReservationDB.id == reservation_id).first()
    if reservation is None:
        raise HTTPException(status_code=404, detail="Reservation not found")
    return reservation

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

@app.delete("/reservations/{reservation_id}", response_model=ReservationResponse)
def delete_reservation(reservation_id: int, db: Session = Depends(get_db)):
    db_reservation = db.query(ReservationDB).filter(ReservationDB.id == reservation_id).first()
    if db_reservation is None:
        raise HTTPException(status_code=404, detail="Reservation not found")
    db.delete(db_reservation)
    db.commit()
    return db_reservation


# initial data
@app.on_event("startup")
def startup_event():
    db = SessionLocal()
    try:
        # 초기 데이터 삽입
        test_data = [
            ReservationDB(id=1, date="2025-02-25", user="joon", text="reserved", startTime="10:00", endTime="11:40", room="room1"),
            ReservationDB(id=2, date="2025-02-10", user="joon", text="meeting1", startTime="10:00", endTime="11:40", room="room1"),
        ]
        for data in test_data:
            db.merge(data)
        db.commit()
    finally:
        db.close()



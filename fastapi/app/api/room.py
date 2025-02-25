from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from ..models import RoomDB
from ..database import get_db
from ..schemas import RoomCreateResponse, RoomCreate


router = APIRouter()

# 새로운 회의실 생성
@router.post("/rooms/", response_model=RoomCreateResponse)
def create_room(creation: RoomCreate, db: Session = Depends(get_db)):
    # 예약 생성
    db_reservation = RoomDB(**creation.model_dump())

    try:
        db.add(db_reservation)
        db.commit()
        db.refresh(db_reservation)
    except IntegrityError:
        raise HTTPException(status_code=404, detail="Duplicated Room")
    
    return db_reservation

# 모든 회의실 조회
@router.get("/rooms/", response_model=list[RoomCreateResponse])
def read_rooms(skip: int = 0, limit: int = 1000, db: Session = Depends(get_db)):
    reservations = db.query(RoomDB).offset(skip).limit(limit).all()
    return reservations

# 회의실 정보 수정
@router.put("/rooms/{room_id}", response_model=RoomCreateResponse)
def update_room(room_id: int, room: RoomCreate, db: Session = Depends(get_db)):
    db_room = db.query(RoomDB).filter(RoomDB.id == room_id).first()
    if db_room is None:
        raise HTTPException(status_code=404, detail="Room not found")

    db_room.name = room.name
    db_room.position = room.position
    db_room.details = room.details
    db.commit()
    db.refresh(db_room)
    return db_room

# 회의실 삭제
@router.delete("/rooms/{room_id}", response_model=RoomCreateResponse)
def delete_room(room_id: int, db: Session = Depends(get_db)):
    db_room = db.query(RoomDB).filter(RoomDB.id == room_id).first()
    if db_room is None:
        raise HTTPException(status_code=404, detail="Reservation not found")

    db.delete(db_room)
    db.commit()
    return db_room
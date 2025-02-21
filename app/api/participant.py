from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from models import RoomDB, ParticipantDB
from database import get_db
from schemas import ParticipantsCreate
from fastapi.responses import JSONResponse

router = APIRouter()

# 새로운 참여자 목록 생성
@router.post("/participants/{reservation_id}")
def create_participants(reservation_id: int, creation: ParticipantsCreate, db: Session = Depends(get_db)):
    # 예약 생성
    for participant_name in creation.participants:
        db.add(ParticipantDB(id=reservation_id, participantName=participant_name))
        db.commit()
    
    return { "message": "Participants created successfully"}

# 참여자 목록 조회
@router.get("/participants/{reservation_id}", response_model=ParticipantsCreate)
def read_participants(reservation_id: int, db: Session = Depends(get_db)):
    participants = db.query(ParticipantDB).filter(ParticipantDB.id == reservation_id).all()
    return ParticipantsCreate(
        participantsList=[p.participantName for p in participants]
    )

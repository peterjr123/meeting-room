from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from models import RecurringReservationDB, CommonReservationDB, UserDB, ParticipantDB
from database import get_db, engine
from schemas import RecurringReservationCreate, RecurringReservationResponse
from api.utils import is_recurring_reservation_conflict

router = APIRouter()


# 새로운 정기 예약 생성
@router.post("/reservations/recur/", response_model=RecurringReservationResponse)
def create_recurring_reservation(reservation: RecurringReservationCreate, db: Session = Depends(get_db)):
    # 중복 검사
    if is_recurring_reservation_conflict(db, reservation.dayInWeek, reservation.startTime, reservation.endTime, reservation.room):
        raise HTTPException(status_code=400, detail="Reservation conflicts with an existing reservation")

    # 사용자가 존재하지 않으면 사용자 생성
    if (db.query(UserDB).filter(UserDB.id == reservation.userId).first()) is None:
        db_user = UserDB(id=reservation.userId, name=reservation.userName)
        db.add(db_user)
        db.commit()

    # 예약 생성
    try:
        db_reservation = CommonReservationDB(
            userId = reservation.userId,
            startTime = reservation.startTime,
            endTime = reservation.endTime,
            room = reservation.room,
            purpose = reservation.purpose,
            details = reservation.details
        )
        db.add(db_reservation)
        db.commit()
        db.refresh(db_reservation)
    except IntegrityError as e:
        print(e)
        db.rollback()
        raise HTTPException(status_code=400, detail="no room exist specified by .room field")
    except Exception as e:
        print(e)
    
    # 참여자 정보 저장
    try:
        for participant_name in reservation.participants:
            db.add(ParticipantDB(id=db_reservation.id, participantName=participant_name))
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    
    # Recurring 정보 저장
    try: 
        db_onetime = RecurringReservationDB(
            id = db_reservation.id,
            dayInWeek = reservation.dayInWeek
        )
        db.add(db_onetime)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    
    return RecurringReservationResponse(**reservation.model_dump(), id=db_reservation.id)


# 모든 정기 예약 조회
@router.get("/reservations/recur/", response_model=list[RecurringReservationResponse])
def read_recurring_reservations(skip: int = 0, limit: int = 1000, db: Session = Depends(get_db)):
    reservations = db.query(RecurringReservationDB, CommonReservationDB, UserDB).join(CommonReservationDB, CommonReservationDB.id == RecurringReservationDB.id).join(UserDB, CommonReservationDB.userId == UserDB.id).offset(skip).limit(limit).all()
    return [
        RecurringReservationResponse(
            id=common.id,
            userId=user.id,
            userName=user.name,
            purpose=common.purpose,
            details=common.details,
            startTime=common.startTime,
            endTime=common.endTime,
            room=common.room,
            dayInWeek=recur.dayInWeek,
            participants=[p.participantName for p in db.query(ParticipantDB).filter(ParticipantDB.id == common.id).all()],
        )
        for recur, common, user in reservations
    ]

# 정기 예약 삭제
@router.delete("/reservations/recur/{reservation_id}", response_model=RecurringReservationResponse)
def delete_recurring_reservation(reservation_id: int, db: Session = Depends(get_db)):
    db_reservation = db.query(RecurringReservationDB, CommonReservationDB, UserDB).filter(CommonReservationDB.id == reservation_id).join(CommonReservationDB, CommonReservationDB.id == RecurringReservationDB.id).join(UserDB, CommonReservationDB.userId == UserDB.id).first()
    if db_reservation is None:
        raise HTTPException(status_code=404, detail="Reservation not found")
    recur, common, user = db_reservation
    response = RecurringReservationResponse(
        id=common.id,
        userId=user.id,
        userName=user.name,
        purpose=common.purpose,
        details=common.details,
        startTime=common.startTime,
        endTime=common.endTime,
        room=common.room,
        dayInWeek=recur.dayInWeek,
        participants=[p.participantName for p in db.query(ParticipantDB).filter(ParticipantDB.id == common.id).all()],
    )
    db.delete(db_reservation.CommonReservationDB)
    db.commit()
    
    return response

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from models import UserDB, OnetimeReservationDB, CommonReservationDB, ParticipantDB
from database import get_db
from schemas import OnetimeReservationResponse, OnetimeReservationCreate
from api.utils import is_reservation_conflict, to_date_string, to_datetime
from sqlalchemy import and_, or_, func


router = APIRouter()



# 새로운 예약 생성
@router.post("/reservations/", response_model=OnetimeReservationResponse)
def create_reservation(reservation: OnetimeReservationCreate, db: Session = Depends(get_db)):
    # 중복 검사
    if is_reservation_conflict(db, reservation.date, reservation.startTime, reservation.endTime, reservation.room):
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
    
    # Onetime 정보 저장
    try: 
        db_onetime = OnetimeReservationDB(
            id = db_reservation.id,
            date = to_datetime(reservation.date)
        )
        db.add(db_onetime)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    
    
    
    return OnetimeReservationResponse(**reservation.model_dump(), id=db_reservation.id)

# 모든 예약 조회
@router.get("/reservations/", response_model=list[OnetimeReservationResponse])
def read_reservations(skip: int = 0, limit: int = 1000, db: Session = Depends(get_db)):
    reservations = db.query(OnetimeReservationDB, CommonReservationDB, UserDB).join(CommonReservationDB, CommonReservationDB.id == OnetimeReservationDB.id).join(UserDB, CommonReservationDB.userId == UserDB.id).offset(skip).limit(limit).all()
    
    return [
        OnetimeReservationResponse(
            id=common.id,
            userId=user.id,
            userName=user.name,
            purpose=common.purpose,
            details=common.details,
            startTime=common.startTime,
            endTime=common.endTime,
            room=common.room,
            participants=[p.participantName for p in db.query(ParticipantDB).filter(ParticipantDB.id == common.id).all()],
            date=to_date_string(onetime.date)
        )
        for onetime, common, user in reservations
    ]


# 현재 시간 이후의 예약 조회 API
@router.get("/reservations/upcoming", response_model=list[OnetimeReservationResponse])
def get_upcoming_reservations(
    base_time: str = Query(..., description="기준 시간 (HH:MM)"),
    base_date: str = Query(..., description="기준 날짜 (YYYY-MM-DD)"),
    db: Session = Depends(get_db)
):
    # 날짜가 base_date 이후이거나, 같은 날짜에서 base_time 이후인 예약 조회
    upcoming_reservations = db.query(OnetimeReservationDB, CommonReservationDB, UserDB).filter(
        or_(
            OnetimeReservationDB.date > to_datetime(base_date),  # 날짜가 base_date 이후
            and_(
                OnetimeReservationDB.date == to_datetime(base_date),  # 같은 날짜
                CommonReservationDB.endTime >= base_time  # base_time 이후
            )
        )
    ).join(CommonReservationDB, CommonReservationDB.id == OnetimeReservationDB.id).join(UserDB, CommonReservationDB.userId == UserDB.id).all()

    return [
        OnetimeReservationResponse(
            id=common.id,
            userId=user.id,
            userName=user.name,
            purpose=common.purpose,
            details=common.details,
            startTime=common.startTime,
            endTime=common.endTime,
            room=common.room,
            date=to_date_string(onetime.date),
            participants=[p.participantName for p in db.query(ParticipantDB).filter(ParticipantDB.id == common.id).all()],
        )
        for onetime, common, user in upcoming_reservations
    ]


# 예약 삭제
@router.delete("/reservations/{reservation_id}", response_model=OnetimeReservationResponse)
def delete_reservation(reservation_id: int, db: Session = Depends(get_db)):
    db_reservation = db.query(OnetimeReservationDB, CommonReservationDB, UserDB).filter(CommonReservationDB.id == reservation_id).join(CommonReservationDB, CommonReservationDB.id == OnetimeReservationDB.id).join(UserDB, CommonReservationDB.userId == UserDB.id).first()
    if db_reservation is None:
        raise HTTPException(status_code=404, detail="Reservation not found")
    onetime, common, user = db_reservation
    response = OnetimeReservationResponse(
        id=common.id,
        userId=user.id,
        userName=user.name,
        purpose=common.purpose,
        details=common.details,
        startTime=common.startTime,
        endTime=common.endTime,
        room=common.room,
        date=to_date_string(onetime.date),
        participants=[p.participantName for p in db.query(ParticipantDB).filter(ParticipantDB.id == common.id).all()],
    )
    db.delete(db_reservation.CommonReservationDB)
    db.commit()
    
    
    return response
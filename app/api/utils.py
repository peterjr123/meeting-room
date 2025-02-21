from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, func
from datetime import datetime
from ..models import RecurringReservationDB, CommonReservationDB, OnetimeReservationDB

# 주어진 Onetime Reservation이 겹치는지 판단.
def is_reservation_conflict(db: Session, date: str, startTime: str, endTime: str, room: str, reservation_id: int = None):
    # 동일한 날짜와 회의실에서 시간대가 겹치는 예약이 있는지 확인
    onetime_reservations = db.query(CommonReservationDB, OnetimeReservationDB).join(CommonReservationDB, CommonReservationDB.id == OnetimeReservationDB.id).filter(
        and_(
            CommonReservationDB.room == room,  # 같은 회의실
            OnetimeReservationDB.date == to_datetime(date),  # 같은 날짜
        )
    )

    onetime_reservations = filter_time_conflict_reservation(onetime_reservations, startTime, endTime)
    print(onetime_reservations.count())

    # 동일한 예약은 항상 제외
    onetime_reservations = onetime_reservations.filter(CommonReservationDB.id != reservation_id)
    
    recurring_reservations = db.query(RecurringReservationDB, CommonReservationDB).join(CommonReservationDB, CommonReservationDB.id == RecurringReservationDB.id).filter(
        and_(
            CommonReservationDB.room == room,  # 같은 회의실
            RecurringReservationDB.dayInWeek == to_day_in_week(date),  # 같은 요일
        )
    )
    recurring_reservations = filter_time_conflict_reservation(recurring_reservations, startTime, endTime)

    return (recurring_reservations.first() is not None) or (onetime_reservations.first() is not None)



# 주어진 recurring reservation이 겹치는지 판단
# WARNING!!: func을 사용하고 있으므로, DB가 변경되면 수정해야 할 수 있음.
def is_recurring_reservation_conflict(db: Session, dayInWeek: str, startTime: str, endTime: str, room: str, reservation_id: int = None):
    # 동일한 날짜와 회의실에서 시간대가 겹치는 예약이 있는지 확인
    recurring_reservations = db.query(RecurringReservationDB, CommonReservationDB).join(CommonReservationDB, RecurringReservationDB.id == CommonReservationDB.id).filter(
        and_(
            CommonReservationDB.room == room,  # 같은 회의실
            RecurringReservationDB.dayInWeek == dayInWeek,  # 같은 요일
        )
    )
    recurring_reservations = filter_time_conflict_reservation(recurring_reservations, startTime, endTime)

    # 동일한 예약은 항상 제외
    recurring_reservations = recurring_reservations.filter(RecurringReservationDB.id != reservation_id)

    # onetime 예약과 conflict 확인
    onetime_reservations = db.query(OnetimeReservationDB, CommonReservationDB).join(CommonReservationDB, OnetimeReservationDB.id == CommonReservationDB.id).filter(
        and_(
            func.DATE_FORMAT(OnetimeReservationDB.date, '%W') == dayInWeek,
            CommonReservationDB.room == room,  # 같은 회의실
        )
    )
    onetime_reservations = filter_time_conflict_reservation(onetime_reservations, startTime, endTime)

    return (recurring_reservations.first() is not None) or (onetime_reservations.first() is not None)





# others

def to_datetime(date_string=str):
    return datetime.strptime(date_string, "%Y-%m-%d")

def to_date_string(datetime=datetime):
    return datetime.strftime("%Y-%m-%d")

def to_day_in_week(date_string=str):
    return datetime.strptime(date_string, "%Y-%m-%d").strftime("%A")

# 시간대가 겹치는 reservervation return
def filter_time_conflict_reservation(query, startTime, endTime):
    return query.filter(
        or_(
            and_(CommonReservationDB.startTime <= startTime, CommonReservationDB.endTime >= startTime), 
            and_(CommonReservationDB.startTime <= endTime, CommonReservationDB.endTime >= endTime),  
            and_(CommonReservationDB.startTime >= startTime, CommonReservationDB.endTime <= endTime)
        )
    )
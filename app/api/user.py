from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from ..models import UserDB
from ..database import get_db
from ..schemas import UserCreateResponse, UserCreate


router = APIRouter()

# 새로운 사용자 생성
@router.post("/users/", response_model=UserCreateResponse)
def create_user(creation: UserCreate, db: Session = Depends(get_db)):
    db_user = UserDB(**creation.model_dump())

    try:
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
    except IntegrityError:
        raise HTTPException(status_code=404, detail="Duplicated User")
    
    return db_user

# 모든 사용자 조회
@router.get("/users/", response_model=list[UserCreateResponse])
def read_users(skip: int = 0, limit: int = 1000, db: Session = Depends(get_db)):
    users = db.query(UserDB).offset(skip).limit(limit).all()
    return users


# 특정 사용자 조회
@router.get("/users/{user_id}", response_model=UserCreateResponse)
def read_user(user_id: int, db: Session = Depends(get_db)):
    db_user = db.query(UserDB).filter(UserDB.id == user_id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

# 사용자 정보 수정
@router.put("/users/{user_id}", response_model=UserCreateResponse)
def update_user(user_id: int, user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(UserDB).filter(UserDB.id == user_id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")

    db_user.name = user.name
    db_user.department = user.department
    db.commit()
    db.refresh(db_user)
    return db_user

# 사용자 삭제
@router.delete("/users/{user_id}", response_model=UserCreateResponse)
def delete_user(user_id: int, db: Session = Depends(get_db)):
    db_user = db.query(UserDB).filter(UserDB.id == user_id).first()
    if db_user is None:
        raise HTTPException(status_code=404, detail="User Not Found")

    db.delete(db_user)
    db.commit()
    return db_user
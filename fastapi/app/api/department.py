from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from ..models import DepartmentDB
from ..database import get_db
from ..schemas import DepartmentCreate, DepartmentCreateResponse
from ..init_admin import is_admin_department

router = APIRouter()

# 새로운 부서 생성
@router.post("/departments/", response_model=DepartmentCreateResponse)
def create_department(creation: DepartmentCreate, db: Session = Depends(get_db)):
    db_department = DepartmentDB(**creation.model_dump())

    try:
        db.add(db_department)
        db.commit()
        db.refresh(db_department)
    except IntegrityError:
        raise HTTPException(status_code=404, detail="Duplicated Department")
    
    return db_department


# 모든 부서 조회
@router.get("/departments/", response_model=list[DepartmentCreateResponse])
def read_department(skip: int = 0, limit: int = 1000, db: Session = Depends(get_db)):
    reservations = db.query(DepartmentDB).offset(skip).limit(limit).all()
    return reservations

# 부서 이름 수정
@router.put("/departments/{department_id}", response_model=DepartmentCreateResponse)
def update_department(department_id: int, department: DepartmentCreate, db: Session = Depends(get_db)):
    db_department = db.query(DepartmentDB).filter(DepartmentDB.id == department_id).first()
    if db_department is None:
        raise HTTPException(status_code=404, detail="Department not found")

    if is_admin_department(db, db_department.name):
        raise HTTPException(status_code=404, detail="Cannot Update Admin Dept.")

    db_department.name = department.name
    db.commit()
    db.refresh(db_department)
    return db_department


# 부서 삭제
@router.delete("/departments/{department_id}", response_model=DepartmentCreateResponse)
def delete_department(department_id: int, db: Session = Depends(get_db)):
    db_dept = db.query(DepartmentDB).filter(DepartmentDB.id == department_id).first()
    if db_dept is None:
        raise HTTPException(status_code=404, detail="Department Not Found")
    
    if is_admin_department(db, db_dept.name):
        raise HTTPException(status_code=404, detail="Cannot Delete Admin Dept.")


    db.delete(db_dept)
    db.commit()
    return db_dept
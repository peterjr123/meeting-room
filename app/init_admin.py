import bcrypt
from sqlalchemy.orm import Session
from .models import UserDB, DepartmentDB
from app import ADMIN_DEPARTMENT, ADMIN_PASSWORD, ADMIN_USERNAME


def hash_password(password: str):
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())

def init_admin_user(db: Session):
    admin_dept = DepartmentDB(
        name=ADMIN_DEPARTMENT
    )
    admin_user = UserDB(
        name=ADMIN_USERNAME,
        password=hash_password(ADMIN_PASSWORD),
        department=ADMIN_DEPARTMENT,
    )
    db_admin_dept = db.query(DepartmentDB).filter(DepartmentDB.name == admin_dept.name).first()
    if not db_admin_dept:
        db.add(admin_dept)
        db.commit()
        print("[init_admin.py] 관리자 부서 생성 완료.")
    db_admin_user = db.query(UserDB).filter(UserDB.name ==admin_user.name).first()
    if not db_admin_user:
        db.add(admin_user)
        db.commit()
        db.refresh(admin_user)
        print("[init_admin.py] 관리자 계정 생성 완료.")

def is_admin_user(db: Session, user_name):
    db_admin_user = db.query(UserDB).filter(UserDB.name == user_name).first()
    if not (db_admin_user.name == ADMIN_USERNAME):
        return False
    else:
        return True    
    
def is_admin_department(db: Session, dept_name):
    db_admin_dept = db.query(DepartmentDB).filter(DepartmentDB.name == dept_name).first()
    if not (db_admin_dept.name == ADMIN_DEPARTMENT):
        return False
    else:
        return True    

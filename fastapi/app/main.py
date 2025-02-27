from fastapi import FastAPI
from app import router_onetime, router_participant, router_recur, router_room , router_user, router_department
from app import Base
from app import engine
from app import init_admin_user, SessionLocal
from contextlib import asynccontextmanager




Base.metadata.create_all(bind=engine)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # 애플리케이션 시작 시 초기 데이터 삽입
    db = SessionLocal()
    init_admin_user(db)
    db.close()
    yield

app = FastAPI(lifespan=lifespan)

app.include_router(router_room, tags=["rooms"])
app.include_router(router_onetime, tags=["onetime reservation"])
app.include_router(router_recur, tags=["recurring reservation"])
app.include_router(router_participant, tags=["particiapants"])
app.include_router(router_user, tags=["users"])
app.include_router(router_department, tags=["departments"])

from fastapi import FastAPI
from app import router_onetime, router_participant, router_recur, router_room 
from app import Base
from app import engine

Base.metadata.create_all(bind=engine)
app = FastAPI()


app.include_router(router_room, tags=["rooms"])
app.include_router(router_onetime, tags=["onetime reservation"])
app.include_router(router_recur, tags=["recurring reservation"])
app.include_router(router_participant, tags=["particiapants"])


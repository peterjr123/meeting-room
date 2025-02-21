from fastapi import FastAPI
import api.onetime
import api.recur
from models import Base
from database import engine
import api.room

Base.metadata.create_all(bind=engine)
app = FastAPI()


app.include_router(api.room.router, tags=["rooms"])
app.include_router(api.onetime.router, tags=["onetime reservation"])
app.include_router(api.recur.router, tags=["recurring reservation"])


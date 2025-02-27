import os
from dotenv import load_dotenv

# 환경변수 load
load_dotenv()

SQLALCHEMY_DATABASE_URL = os.getenv("SQLALCHEMY_DATABASE_URL")
ADMIN_USERNAME=os.getenv("ADMIN_USERNAME")
ADMIN_PASSWORD=os.getenv("ADMIN_PASSWORD")
ADMIN_DEPARTMENT=os.getenv("ADMIN_DEPARTMENT")


if not all([SQLALCHEMY_DATABASE_URL, ADMIN_USERNAME, ADMIN_PASSWORD, ADMIN_DEPARTMENT]) :
    raise Exception("environ is Not Found")

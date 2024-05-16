from sqlalchemy.orm import Session
from . import models, schemas
from .database import engine

def create_database():
    models.Base.metadata.create_all(bind=engine)
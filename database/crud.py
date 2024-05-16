from sqlalchemy.orm import Session
from . import models, schemas
from .database import engine

def create_database():
    models.Base.metadata.create_all(bind=engine)

def get_shops(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.ShopLocation).offset(skip).limit(limit).all()

def create_shop(db: Session, shop: schemas.ShopLocationCreate):
    db_shop = models.ShopLocation(**shop.dict())
    db.add(db_shop)
    db.commit()
    db.refresh(db_shop)
    return db_shop
from sqlalchemy.orm import Session
from . import models, schemas
from .database import engine

def create_database():
    models.Base.metadata.create_all(bind=engine)

def get_shops(db: Session, skip: int = 0, limit: int = 100, latitude: float = None, longitude: float = None):
    query = db.query(models.ShopLocation)
    if latitude is not None and longitude is not None:
        # Filter shops based on proximity to the given latitude and longitude
        # You can customize this logic based on your specific requirements
        query = query.filter(
            models.ShopLocation.latitude.between(latitude - 0.1, latitude + 0.1),
            models.ShopLocation.longitude.between(longitude - 0.1, longitude + 0.1),
        )
    return query.offset(skip).limit(limit).all()

def create_shop(db: Session, shop: schemas.ShopLocationCreate):
    db_shop = models.ShopLocation(**shop.dict())
    db.add(db_shop)
    db.commit()
    db.refresh(db_shop)
    return db_shop
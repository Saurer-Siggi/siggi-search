from fastapi import Depends, FastAPI
from sqlalchemy.orm import Session

from database import crud, models, schemas
from database.database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/shops/", response_model=schemas.ShopLocation)
def create_shop(shop: schemas.ShopLocationCreate, db: Session = Depends(get_db)):
    return crud.create_shop(db=db, shop=shop)

@app.get("/shops/", response_model=list[schemas.ShopLocation])
def read_shops(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    shops = crud.get_shops(db, skip=skip, limit=limit)
    return shops
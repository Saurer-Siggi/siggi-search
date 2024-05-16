import os
from dotenv import load_dotenv

from fastapi import Depends, FastAPI, Query, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from starlette.status import HTTP_401_UNAUTHORIZED
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from database import crud, models, schemas
from database.database import SessionLocal, engine

load_dotenv()

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

JWT_SECRET = os.getenv("JWT_SECRET")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
        username = payload.get("username")
        if username is None:
            raise HTTPException(status_code=HTTP_401_UNAUTHORIZED, detail="Invalid authentication credentials")
        return username
    except JWTError:
        raise HTTPException(status_code=HTTP_401_UNAUTHORIZED, detail="Invalid authentication credentials")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/shops/", dependencies=[Depends(get_current_user)])
def create_shop(shop: schemas.ShopLocationCreate, db: Session = Depends(get_db)):
    return crud.create_shop(db=db, shop=shop)

@app.get("/shops/", response_model=list[schemas.ShopLocation])
def read_shops(
    skip: int = 0,
    limit: int = 100,
    latitude: float = Query(None),
    longitude: float = Query(None),
    db: Session = Depends(get_db),
):
    shops = crud.get_shops(db, skip=skip, limit=limit, latitude=latitude, longitude=longitude)
    return shops

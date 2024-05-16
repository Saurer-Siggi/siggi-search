from pydantic import BaseModel

class ShopLocationBase(BaseModel):
    name: str
    address: str
    latitude: float
    longitude: float
    google_maps_link: str

class ShopLocationCreate(ShopLocationBase):
    pass

class ShopLocation(ShopLocationBase):
    id: int

    class Config:
        orm_mode = True
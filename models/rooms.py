from models.engine.filestorage import FileStorage
from models.base_model import BaseModel
from sqlalchemy import Column, Integer, String, Text, Float
import models

class Room(BaseModel):
    if models.storage_t == 'db':
        __tablename__ = 'rooms'

        id = Column(Integer, primary_key=True)
        name = Column(String(100), nullable=False)
        description = Column(Text)
        price = Column(Float, nullable=False)
        image = Column(String(255), nullable=False)


from models.engine.filestorage import FileStorage

class Room(BaseModel,):
    __tablename__ = 'rooms'

    id = db.Column(db.Integer, primary_key=True)


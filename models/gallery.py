from models import BaseModel
from database.dbstorage import db
from database.filestorage import FileStorage

class Gallery(BaseModel, db.Model):
    """Gallery model for storing images and their details"""
    __tablename__ = 'gallery'
    
    title = db.Column(db.String(255), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    location = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    image = db.Column(db.String(255), nullable=False)

    def to_dict(self):
        """Convert gallery item to dictionary"""
        base_dict = super().to_dict()
        base_dict.update({
            'title': self.title,
            'category': self.category,
            'location': self.location,
            'description': self.description,
            'image': self.image
        })
        return base_dict

    @classmethod
    def create(cls, title, category, location, description, image_file):
        """Create a new gallery item with file upload"""
        image_path = FileStorage.save_file(image_file, 'gallery')
        if image_path:
            gallery_item = cls(
                title=title,
                category=category,
                location=location,
                description=description,
                image=image_path
            )
            gallery_item.save()
            return gallery_item
        return None

    def update(self, title=None, category=None, location=None, 
               description=None, image_file=None):
        """Update gallery item"""
        if title:
            self.title = title
        if category:
            self.category = category
        if location:
            self.location = location
        if description:
            self.description = description
        if image_file:
            # Delete old image
            FileStorage.delete_file(self.image)
            # Save new image
            new_image_path = FileStorage.save_file(image_file, 'gallery')
            if new_image_path:
                self.image = new_image_path
        self.save()

    def delete(self):
        """Delete gallery item and its image"""
        FileStorage.delete_file(self.image)
        super().delete() 
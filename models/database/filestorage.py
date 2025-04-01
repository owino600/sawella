import os
from werkzeug.utils import secure_filename
from flask import current_app

class FileStorage:
    """Handle file storage operations"""
    
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
    UPLOAD_FOLDER = 'static/uploads'

    @staticmethod
    def allowed_file(filename):
        """Check if file extension is allowed"""
        return '.' in filename and \
               filename.rsplit('.', 1)[1].lower() in FileStorage.ALLOWED_EXTENSIONS

    @staticmethod
    def save_file(file, folder=''):
        """Save uploaded file"""
        if file and FileStorage.allowed_file(file.filename):
            filename = secure_filename(file.filename)
            # Create folder if it doesn't exist
            upload_path = os.path.join(current_app.root_path, FileStorage.UPLOAD_FOLDER, folder)
            os.makedirs(upload_path, exist_ok=True)
            
            # Save file
            file_path = os.path.join(upload_path, filename)
            file.save(file_path)
            
            # Return relative path for database storage
            return os.path.join(FileStorage.UPLOAD_FOLDER, folder, filename)
        return None

    @staticmethod
    def delete_file(file_path):
        """Delete file from storage"""
        if file_path:
            full_path = os.path.join(current_app.root_path, file_path)
            if os.path.exists(full_path):
                os.remove(full_path) 
from flask import Flask, jsonify
from flask_cors import CORS
from database.dbstorage import init_db
from modules.gallery import Gallery

app = Flask(__name__)
CORS(app)

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://your_username:your_password@localhost/capella_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = 'static/uploads'

# Initialize database
init_db(app)

@app.route('/api/gallery', methods=['GET'])
def get_gallery():
    try:
        gallery_items = Gallery.get_all()
        return jsonify({
            'success': True,
            'data': [item.to_dict() for item in gallery_items]
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': 'Failed to fetch gallery items',
            'error': str(e)
        }), 500

if __name__ == '__main__':
    app.run(debug=True) 
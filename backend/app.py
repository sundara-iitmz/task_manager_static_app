from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime
import os
""" author = Sundara Bharathi"""

app = Flask(__name__)

# Enable CORS for all routes to allow frontend to communicate
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Database Configuration
# Use environment variable if available (Docker/Render), otherwise use localhost for MySQL
# Supports both MySQL (local dev) and PostgreSQL (Render production)
database_url = os.getenv('DATABASE_URL', 'mysql+pymysql://root:passw0rd@localhost:3308/app_db?charset=utf8mb4')

# Fix SQLAlchemy 1.4+ compatibility with PostgreSQL URLs
if database_url.startswith('postgres://'):
    database_url = database_url.replace('postgres://', 'postgresql://', 1)

app.config['SQLALCHEMY_DATABASE_URI'] = database_url

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize SQLAlchemy
db = SQLAlchemy(app)


# ==================== DATABASE MODELS ====================
class Task(db.Model):
    __tablename__ = 'tasks'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text)
    status = db.Column(db.String(50), default='pending')  # pending, in_progress, completed
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'status': self.status,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M:%S'),
            'updated_at': self.updated_at.strftime('%Y-%m-%d %H:%M:%S')
        }


# ==================== CRUD ROUTES ====================

# CREATE - Add a new task
@app.route('/api/tasks', methods=['POST'])
def create_task():
    try:
        data = request.get_json()

        if not data or not data.get('title'):
            return jsonify({'error': 'Title is required'}), 400

        new_task = Task(
            title=data.get('title'),
            description=data.get('description', ''),
            status=data.get('status', 'pending')
        )

        db.session.add(new_task)
        db.session.commit()

        return jsonify({
            'message': 'Task created successfully',
            'task': new_task.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


# READ - Get all tasks
@app.route('/api/tasks', methods=['GET'])
def get_all_tasks():
    try:
        tasks = Task.query.all()
        return jsonify({
            'message': 'Tasks retrieved successfully',
            'count': len(tasks),
            'tasks': [task.to_dict() for task in tasks]
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# READ - Get a single task by ID
@app.route('/api/tasks/<int:task_id>', methods=['GET'])
def get_task(task_id):
    try:
        task = Task.query.get(task_id)

        if not task:
            return jsonify({'error': 'Task not found'}), 404

        return jsonify({
            'message': 'Task retrieved successfully',
            'task': task.to_dict()
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# UPDATE - Update a task
@app.route('/api/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    try:
        task = Task.query.get(task_id)

        if not task:
            return jsonify({'error': 'Task not found'}), 404

        data = request.get_json()

        # Update only provided fields
        if 'title' in data:
            task.title = data['title']
        if 'description' in data:
            task.description = data['description']
        if 'status' in data:
            task.status = data['status']

        db.session.commit()

        return jsonify({
            'message': 'Task updated successfully',
            'task': task.to_dict()
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


# DELETE - Delete a task
@app.route('/api/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    try:
        task = Task.query.get(task_id)

        if not task:
            return jsonify({'error': 'Task not found'}), 404

        db.session.delete(task)
        db.session.commit()

        return jsonify({
            'message': 'Task deleted successfully',
            'task_id': task_id
        }), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


# ==================== ORIGINAL ROUTES ====================

@app.route('/')
def home():
    return jsonify({'message': 'Welcome to Task Manager API', 'status': 'running'})


@app.route('/hello')
def hello():
    return jsonify({'message': 'Hello , World !'})


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        print("[OK] Database tables created successfully!")
    # Run in debug mode only if not in production (Docker environment)
    debug_mode = os.getenv('FLASK_ENV') == 'development'
    app.run(debug=debug_mode, host='0.0.0.0', port=5000)

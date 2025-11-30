-- Initialize database with app_db
USE app_db;

-- Create tasks table if it doesn't exist
CREATE TABLE IF NOT EXISTS tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Sample data (optional - comment out if not needed)
-- INSERT INTO tasks (title, description, status) VALUES
-- ('Welcome to Task Manager', 'This is your first task', 'completed'),
-- ('Get started with Docker', 'Learn about containerization', 'in_progress'),
-- ('Explore the application', 'Familiarize yourself with the UI', 'pending');

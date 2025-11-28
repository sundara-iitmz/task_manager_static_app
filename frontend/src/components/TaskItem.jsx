import { useState } from 'react';

export default function TaskItem({
    task,
    isEditing,
    onToggleTask,
    onEditTask,
    onUpdateTask,
    onDeleteTask,
    onCancelEdit
}) {
    const [editText, setEditText] = useState(task.text);

    const handleSave = async () => {
        if (editText.trim()) {
            await onUpdateTask(task.id, editText);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSave();
        } else if (e.key === 'Escape') {
            onCancelEdit();
        }
    };

    if (isEditing) {
        return (
            <li className="task-item">
                <input
                    type="checkbox"
                    disabled
                    checked={task.completed}
                />
                <input
                    type="text"
                    className="edit-input"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    autoFocus
                />
                <button className="save-btn" onClick={handleSave}>
                    Save
                </button>
                <button className="cancel-btn" onClick={onCancelEdit}>
                    Cancel
                </button>
            </li>
        );
    }

    return (
        <li className="task-item">
            <input
                type="checkbox"
                checked={task.completed}
                onChange={() => onToggleTask(task.id)}
            />
            <span className={task.completed ? 'completed' : ''}>
                {task.text}
            </span>
            <button
                className="edit-btn"
                onClick={() => {
                    onEditTask(task.id);
                    setEditText(task.text);
                }}
            >
                Edit
            </button>
            <button
                className="delete-btn"
                onClick={() => onDeleteTask(task.id)}
            >
                Delete
            </button>
        </li>
    );
}

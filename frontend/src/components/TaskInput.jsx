import { useState } from 'react';

export default function TaskInput({ onAddTask }) {
    const [inputValue, setInputValue] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (inputValue.trim()) {
            await onAddTask(inputValue);
            setInputValue('');
        }
    };

    return (
        <form className="task-input" onSubmit={handleSubmit}>
            <input
                type="text"
                id="taskInput"
                placeholder="Enter a new task..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
            />
            <button id="addBtn" type="submit">
                Add Task
            </button>
        </form>
    );
}

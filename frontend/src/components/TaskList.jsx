import TaskItem from './TaskItem';

export default function TaskList({
    tasks,
    editingId,
    onToggleTask,
    onEditTask,
    onUpdateTask,
    onDeleteTask,
    onCancelEdit
}) {
    return (
        <ul className="task-list">
            {tasks.map((task) => (
                <TaskItem
                    key={task.id}
                    task={task}
                    isEditing={editingId === task.id}
                    onToggleTask={onToggleTask}
                    onEditTask={onEditTask}
                    onUpdateTask={onUpdateTask}
                    onDeleteTask={onDeleteTask}
                    onCancelEdit={onCancelEdit}
                />
            ))}
        </ul>
    );
}

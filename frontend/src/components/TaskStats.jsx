export default function TaskStats({ tasks }) {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;

    return (
        <div id="stats" className="stats">
            Total: {totalTasks} | Completed: {completedTasks}
        </div>
    );
}

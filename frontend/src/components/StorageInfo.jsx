export default function StorageInfo({ backendAvailable, taskCount }) {
    const backendStatus = backendAvailable ? '✓ Connected' : '⚠️ Using localStorage';
    const backendColor = backendAvailable ? '#28a745' : '#ff9800';
    const dataSource = backendAvailable ? 'Backend (MySQL)' : 'Browser Storage';

    return (
        <div id="storageInfo" className="storage-info">
            <p>
                <strong>Data Source:</strong> <span style={{ color: backendColor }}>{dataSource}</span>
            </p>
            <p style={{ color: backendColor }}>
                <strong>{backendStatus}</strong>
            </p>
            <p>📦 Tasks in memory: {taskCount}</p>
        </div>
    );
}

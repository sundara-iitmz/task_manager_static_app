export default function Notification({ message, type = 'info' }) {
    return (
        <div className={`notification notification-${type}`}>
            {message}
        </div>
    );
}

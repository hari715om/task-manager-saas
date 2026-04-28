import { updateTask, deleteTask } from '../api/tasks';

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M2.5 7L5.5 10L11.5 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M2 3.5h10M5.5 3.5V2.5h3V3.5M5 6v4.5M9 6v4.5M3.5 3.5l.5 8h6l.5-8" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const TaskCard = ({ task, onUpdated, onDeleted }) => {
  const isCompleted = task.status === 'completed';

  const handleToggle = async () => {
    try {
      const newStatus = isCompleted ? 'pending' : 'completed';
      const { data } = await updateTask(task.id, { status: newStatus });
      onUpdated(data);
    } catch {
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTask(task.id);
      onDeleted(task.id);
    } catch {
    }
  };

  return (
    <div
      className="card animate-fade-in"
      style={{
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 14,
        transition: 'box-shadow var(--transition)',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = 'var(--shadow-md)')}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = 'var(--shadow-sm)')}
    >
      <button
        onClick={handleToggle}
        title={isCompleted ? 'Mark as pending' : 'Mark as completed'}
        style={{
          width: 20,
          height: 20,
          borderRadius: 4,
          border: isCompleted ? 'none' : '1.5px solid var(--color-border-strong)',
          background: isCompleted ? '#16a34a' : 'transparent',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          flexShrink: 0,
          marginTop: 2,
          transition: 'all var(--transition)',
        }}
      >
        {isCompleted && <CheckIcon />}
      </button>

      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontWeight: 500,
            color: isCompleted ? 'var(--color-text-muted)' : 'var(--color-text-primary)',
            textDecoration: isCompleted ? 'line-through' : 'none',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            marginBottom: 4,
            transition: 'color var(--transition)',
          }}
        >
          {task.title}
        </p>
        {task.description && (
          <p
            style={{
              fontSize: 13,
              color: 'var(--color-text-secondary)',
              overflow: 'hidden',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
            }}
          >
            {task.description}
          </p>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
          <span className={`badge ${isCompleted ? 'badge-completed' : 'badge-pending'}`}>
            {isCompleted ? 'Completed' : 'Pending'}
          </span>
          <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
            {new Date(task.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            })}
          </span>
        </div>
      </div>

      <button className="btn-danger" onClick={handleDelete} title="Delete task">
        <TrashIcon />
      </button>
    </div>
  );
};

export default TaskCard;

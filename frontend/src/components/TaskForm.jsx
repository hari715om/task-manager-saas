import { useState } from 'react';
import { createTask } from '../api/tasks';

const PlusIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const TaskForm = ({ onCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    setError('');
    try {
      const { data } = await createTask({ title: title.trim(), description: description.trim() });
      onCreated(data);
      setTitle('');
      setDescription('');
      setOpen(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <button
        className="btn-secondary"
        onClick={() => setOpen(true)}
        style={{ display: 'flex', alignItems: 'center', gap: 6 }}
      >
        <PlusIcon />
        Add task
      </button>
    );
  }

  return (
    <div className="card animate-fade-in" style={{ padding: 20 }}>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            className="input-field"
            type="text"
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
            maxLength={200}
          />
        </div>
        <div className="form-group">
          <textarea
            className="input-field"
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>

        {error && <div className="alert-error" style={{ marginBottom: 12 }}>{error}</div>}

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => { setOpen(false); setError(''); setTitle(''); setDescription(''); }}
          >
            Cancel
          </button>
          <button type="submit" className="btn-primary" disabled={loading || !title.trim()}>
            {loading ? <span className="loading-spinner" /> : null}
            Add task
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;

import { useState, useEffect } from 'react';
import { fetchTasks } from '../api/tasks';
import { useAuth } from '../context/AuthContext';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import Navbar from '../components/Navbar';

const EmptyState = () => (
  <div
    style={{
      textAlign: 'center',
      padding: '60px 24px',
      color: 'var(--color-text-muted)',
    }}
  >
    <div style={{ fontSize: 32, marginBottom: 12 }}>✓</div>
    <p style={{ fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: 4 }}>
      No tasks yet
    </p>
    <p style={{ fontSize: 13 }}>Add your first task above to get started</p>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const { data } = await fetchTasks();
        setTasks(data);
      } catch {
        setError('Failed to load tasks. Please refresh the page.');
      } finally {
        setLoading(false);
      }
    };
    loadTasks();
  }, []);

  const handleCreated = (newTask) => {
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleUpdated = (updatedTask) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
    );
  };

  const handleDeleted = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'pending') return t.status === 'pending';
    if (filter === 'completed') return t.status === 'completed';
    return true;
  });

  const pendingCount = tasks.filter((t) => t.status === 'pending').length;
  const completedCount = tasks.filter((t) => t.status === 'completed').length;

  return (
    <div className="page-container">
      <Navbar />

      <main style={{ maxWidth: 720, margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ marginBottom: 28 }}>
          <h1
            style={{
              fontSize: 20,
              fontWeight: 600,
              letterSpacing: '-0.025em',
              color: 'var(--color-text-primary)',
              marginBottom: 4,
            }}
          >
            My Tasks
          </h1>
          <p style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
            Welcome back, {user?.name} —{' '}
            {pendingCount === 0
              ? 'all done!'
              : `${pendingCount} task${pendingCount !== 1 ? 's' : ''} remaining`}
          </p>
        </div>

        <div style={{ marginBottom: 24 }}>
          <TaskForm onCreated={handleCreated} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 4 }}>
            {['all', 'pending', 'completed'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: '5px 12px',
                  borderRadius: 6,
                  border: '1px solid',
                  borderColor: filter === f ? 'var(--color-text-primary)' : 'var(--color-border)',
                  background: filter === f ? 'var(--color-text-primary)' : 'transparent',
                  color: filter === f ? '#fff' : 'var(--color-text-secondary)',
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all var(--transition)',
                  textTransform: 'capitalize',
                }}
              >
                {f}
                {f === 'pending' && pendingCount > 0 && (
                  <span
                    style={{
                      marginLeft: 5,
                      background: filter === f ? 'rgba(255,255,255,0.2)' : 'var(--color-bg-hover)',
                      color: filter === f ? '#fff' : 'var(--color-text-muted)',
                      borderRadius: 100,
                      padding: '0 5px',
                      fontSize: 11,
                    }}
                  >
                    {pendingCount}
                  </span>
                )}
                {f === 'completed' && completedCount > 0 && (
                  <span
                    style={{
                      marginLeft: 5,
                      background: filter === f ? 'rgba(255,255,255,0.2)' : 'var(--color-bg-hover)',
                      color: filter === f ? '#fff' : 'var(--color-text-muted)',
                      borderRadius: 100,
                      padding: '0 5px',
                      fontSize: 11,
                    }}
                  >
                    {completedCount}
                  </span>
                )}
              </button>
            ))}
          </div>

          <span style={{ fontSize: 12, color: 'var(--color-text-muted)' }}>
            {filteredTasks.length} task{filteredTasks.length !== 1 ? 's' : ''}
          </span>
        </div>

        {error && (
          <div className="alert-error" style={{ marginBottom: 16 }}>
            {error}
          </div>
        )}

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', paddingTop: 60 }}>
            <div className="loading-spinner-dark" />
          </div>
        ) : filteredTasks.length === 0 ? (
          <EmptyState />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onUpdated={handleUpdated}
                onDeleted={handleDeleted}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;

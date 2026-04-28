import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header
      style={{
        height: 56,
        borderBottom: '1px solid var(--color-border)',
        background: 'var(--color-bg)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
        gap: 16,
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      <span
        style={{
          fontWeight: 600,
          fontSize: 15,
          letterSpacing: '-0.02em',
          color: 'var(--color-text-primary)',
          flexShrink: 0,
        }}
      >
        TaskFlow
      </span>

      <div style={{ flex: 1 }} />

      {user && (
        <>
          <span
            style={{
              fontSize: 13,
              color: 'var(--color-text-secondary)',
              maxWidth: 200,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {user.email}
          </span>
          <button className="btn-secondary" onClick={handleLogout} style={{ padding: '6px 14px' }}>
            Logout
          </button>
        </>
      )}
    </header>
  );
};

export default Navbar;

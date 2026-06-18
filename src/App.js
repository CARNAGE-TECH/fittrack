import { useEffect, useState } from 'react';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import Workout from './components/Workout';
import Macros from './components/Macros';
import Progress from './components/Progress';
import Footer from './components/Footer';
import './App.css';

const NavIcon = ({ tab }) => {
  const icons = {
    dashboard: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
      </svg>
    ),
    workout: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 4v16M18 4v16M3 8h4M17 8h4M3 16h4M17 16h4"/>
      </svg>
    ),
    macros: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a10 10 0 1 0 10 10H12V2z"/><path d="M12 2a10 10 0 0 1 10 10"/>
      </svg>
    ),
    progress: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    )
  };
  return icons[tab];
};

const labels = { dashboard: 'Home', workout: 'Workout', macros: 'Macros', progress: 'Progress' };

function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem('ft_current_user') || 'null');
    if (savedUser?.email) setUser(savedUser);
  }, []);

  const handleSetUser = (nextUser) => {
    setUser(nextUser);
    if (nextUser) {
      localStorage.setItem('ft_current_user', JSON.stringify(nextUser));
    } else {
      localStorage.removeItem('ft_current_user');
      setActiveTab('dashboard');
    }
  };

  if (!user) return <Auth setUser={handleSetUser} />;

  return (
    <div className="app">
      <nav className="nav">
        {['dashboard', 'workout', 'macros', 'progress'].map(tab => (
          <button key={tab} className={activeTab === tab ? 'nav-btn active' : 'nav-btn'} onClick={() => setActiveTab(tab)}>
            <NavIcon tab={tab} />
            {labels[tab]}
          </button>
        ))}
      </nav>

      {activeTab === 'dashboard' && <Dashboard user={user} setUser={handleSetUser} />}
      {activeTab === 'workout' && <Workout user={user} />}
      {activeTab === 'macros' && <Macros user={user} />}
      {activeTab === 'progress' && <Progress user={user} />}

      <Footer />
    </div>
  );
}

export default App;

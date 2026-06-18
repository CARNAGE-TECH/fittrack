import { useState } from 'react';

export default function Auth({ setUser }) {
  const [isLogin, setIsLogin] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    setError('');
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    if (!isLogin && !name) { setError('Please enter your name.'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }

    const users = JSON.parse(localStorage.getItem('ft_users') || '{}');

    if (isLogin) {
      if (!users[email] || users[email].pass !== password) { setError('Incorrect email or password.'); return; }
      setUser({ name: users[email].name, email });
    } else {
      if (users[email]) { setError('An account with this email already exists.'); return; }
      users[email] = { name, pass: password };
      localStorage.setItem('ft_users', JSON.stringify(users));
      setUser({ name, email });
    }
  };

  const inputStyle = {
    width: '100%', padding: '11px 14px', border: '1px solid #e5e7eb',
    borderRadius: '8px', fontSize: '14px', outline: 'none',
    transition: 'border-color 0.15s', fontFamily: 'inherit'
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', background: '#f0f2f5' }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', background: '#185FA5', borderRadius: '16px', marginBottom: '1rem' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8h1a4 4 0 0 1 0 8h-1" /><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
              <line x1="6" y1="1" x2="6" y2="4" /><line x1="10" y1="1" x2="10" y2="4" /><line x1="14" y1="1" x2="14" y2="4" />
            </svg>
          </div>
          <div style={{ fontSize: '26px', fontWeight: '600', color: '#111827', letterSpacing: '-0.5px' }}>FitTrack</div>
          <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>
            {isLogin ? 'Welcome back. Sign in to continue.' : 'Track your splits, log your lifts, hit your goals.'}
          </div>
        </div>

        <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '2rem' }}>
          {!isLogin && (
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '13px', fontWeight: '500', color: '#374151', display: 'block', marginBottom: '6px' }}>Full name</label>
              <input style={inputStyle} placeholder="Joseph" value={name} onChange={e => setName(e.target.value)} />
            </div>
          )}

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: '13px', fontWeight: '500', color: '#374151', display: 'block', marginBottom: '6px' }}>Email</label>
            <input style={inputStyle} type="email" placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: '13px', fontWeight: '500', color: '#374151', display: 'block', marginBottom: '6px' }}>Password</label>
            <input style={inputStyle} type="password" placeholder="********" value={password} onChange={e => setPassword(e.target.value)} />
          </div>

          {error && (
            <div style={{ background: '#FEF2F2', color: '#991B1B', fontSize: '13px', padding: '10px 12px', borderRadius: '8px', marginBottom: '12px' }}>
              {error}
            </div>
          )}

          <button onClick={handleSubmit}
            style={{ width: '100%', padding: '12px', background: '#185FA5', color: 'white', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '500', cursor: 'pointer', transition: 'background 0.15s' }}>
            {isLogin ? 'Sign in' : 'Create account'}
          </button>

          <div style={{ textAlign: 'center', fontSize: '13px', color: '#6b7280', marginTop: '1.25rem' }}>
            {isLogin ? 'New here? ' : 'Already have an account? '}
            <span style={{ color: '#185FA5', cursor: 'pointer', fontWeight: '500' }} onClick={() => { setIsLogin(!isLogin); setError(''); }}>
              {isLogin ? 'Create account' : 'Sign in'}
            </span>
          </div>
          <div style={{ textAlign: 'center', fontSize: '11px', color: '#9ca3af', marginTop: '0.75rem', lineHeight: 1.4 }}>
            Demo login stores data on this device only.
          </div>
        </div>
      </div>
    </div>
  );
}

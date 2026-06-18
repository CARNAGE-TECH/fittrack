import { useState, useEffect } from 'react';

const splitSchedule = ['Upper A', 'Lower A', 'Upper B', 'Lower B'];
const splitDetails = {
  'Upper A': 'Incline bench / Lat pulldown / Barbell row',
  'Upper B': 'Overhead press / Cable row / Face pull',
  'Lower A': 'Barbell squat / Leg press / Walking lunge',
  'Lower B': 'Romanian deadlift / Hip thrust / Leg curl'
};

const getNextSplit = (workouts) => {
  const lastSplit = workouts[workouts.length - 1]?.split;
  const lastIndex = splitSchedule.indexOf(lastSplit);
  return splitSchedule[lastIndex >= 0 ? (lastIndex + 1) % splitSchedule.length : 0];
};

const getActiveStreak = (workouts) => {
  const days = new Set(workouts.map(w => w.date).filter(Boolean));
  let streak = 0;
  const cursor = new Date();

  while (days.has(cursor.toLocaleDateString('en-GB'))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
};

export default function Dashboard({ user, setUser }) {
  const [workouts, setWorkouts] = useState([]);
  const [totals, setTotals] = useState({ cal: 0 });
  const [goals, setGoals] = useState({ cal: 2200 });

  useEffect(() => {
    const key = 'ft_data_' + user.email;
    const saved = JSON.parse(localStorage.getItem(key) || '{}');
    setWorkouts(saved.workouts || []);
    setGoals(saved.goals || { cal: 2200 });
    const today = new Date().toDateString();
    const foodLog = (saved.foodLog || []).filter(f => f.date === today);
    const cal = foodLog.reduce((acc, f) => acc + f.cal, 0);
    setTotals({ cal });
  }, [user]);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const date = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
  const calPct = Math.min(100, Math.round((totals.cal / goals.cal) * 100)) || 0;
  const recent = workouts.slice(-3).reverse();
  const todaySplit = getNextSplit(workouts);
  const activeStreak = getActiveStreak(workouts);

  const cardStyle = {
    background: 'white', border: '1px solid #e5e7eb',
    borderRadius: '12px', padding: '1rem 1.25rem', marginBottom: '1rem'
  };

  return (
    <div style={{ padding: '1.5rem 1rem' }}>

      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '22px', fontWeight: '600', color: '#111827', letterSpacing: '-0.3px' }}>{greeting}, {user.name}</div>
        <div style={{ fontSize: '14px', color: '#6b7280', marginTop: '2px' }}>{date}</div>
      </div>

      <div style={{ background: 'linear-gradient(135deg, #185FA5 0%, #0C447C 100%)', borderRadius: '16px', padding: '1.25rem', marginBottom: '1rem', color: 'white' }}>
        <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Suggested today</div>
        <div style={{ fontSize: '20px', fontWeight: '600', marginBottom: '4px' }}>{todaySplit}</div>
        <div style={{ fontSize: '13px', opacity: 0.75 }}>{splitDetails[todaySplit]}</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '1rem' }}>
        {[['Total workouts', workouts.length], ['Kcal today', totals.cal], ['Day streak', activeStreak]].map(([label, val]) => (
          <div key={label} style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '0.875rem', textAlign: 'center' }}>
            <div style={{ fontSize: '22px', fontWeight: '600', color: '#111827' }}>{val}</div>
            <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '3px' }}>{label}</div>
          </div>
        ))}
      </div>

      <div style={cardStyle}>
        <div style={{ fontSize: '14px', fontWeight: '500', color: '#111827', marginBottom: '10px' }}>Today's calories</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#6b7280', marginBottom: '6px' }}>
          <span>{totals.cal} consumed</span>
          <span>{calPct}% of goal</span>
        </div>
        <div style={{ background: '#f3f4f6', borderRadius: '99px', height: '8px', overflow: 'hidden' }}>
          <div style={{ width: calPct + '%', height: '100%', background: calPct >= 100 ? '#16a34a' : '#185FA5', borderRadius: '99px', transition: 'width 0.4s' }} />
        </div>
        <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '6px', textAlign: 'right' }}>{goals.cal} kcal goal</div>
      </div>

      <div style={cardStyle}>
        <div style={{ fontSize: '14px', fontWeight: '500', color: '#111827', marginBottom: '12px' }}>Recent workouts</div>
        {recent.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '1.5rem', color: '#9ca3af', fontSize: '14px' }}>
            No workouts logged yet. Hit the Workout tab to start.
          </div>
        ) : (
          recent.map((w, i) => (
            <div key={w.id || w.timestamp || i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < recent.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
              <div>
                <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '99px', background: w.split.startsWith('Upper') ? '#EFF6FF' : '#F5F3FF', color: w.split.startsWith('Upper') ? '#1D4ED8' : '#6D28D9', fontWeight: '500' }}>{w.split}</span>
                <span style={{ fontSize: '13px', color: '#6b7280', marginLeft: '8px' }}>{w.date}</span>
              </div>
              <span style={{ fontSize: '13px', color: '#9ca3af' }}>{w.exercises.length} exercises</span>
            </div>
          ))
        )}
      </div>

      <button onClick={() => setUser(null)}
        style={{ width: '100%', padding: '11px', background: 'white', border: '1px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', color: '#6b7280', cursor: 'pointer', marginTop: '0.5rem' }}>
        Sign out
      </button>
    </div>
  );
}

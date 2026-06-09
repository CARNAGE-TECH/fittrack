import { useState, useEffect } from 'react';

export default function Progress({ user }) {
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    const key = 'ft_data_' + user.email;
    const saved = JSON.parse(localStorage.getItem(key) || '{}');
    setWorkouts(saved.workouts || []);
  }, [user]);

  const upper = workouts.filter(w => w.split.startsWith('Upper')).length;
  const lower = workouts.filter(w => w.split.startsWith('Lower')).length;

  const cardStyle = {
    background: 'white', border: '1px solid #e5e7eb',
    borderRadius: '12px', padding: '1rem 1.25rem', marginBottom: '1rem'
  };

  return (
    <div style={{ padding: '1.5rem 1rem' }}>
      <div style={{ fontSize: '22px', fontWeight: '600', color: '#111827', letterSpacing: '-0.3px', marginBottom: '0.25rem' }}>Progress</div>
      <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '1.5rem' }}>Your training history</div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '1rem' }}>
        {[['Total sessions', workouts.length, '#185FA5'], ['Upper days', upper, '#1D4ED8'], ['Lower days', lower, '#6D28D9']].map(([label, val, color]) => (
          <div key={label} style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '0.875rem', textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: '600', color }}>{val}</div>
            <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '3px' }}>{label}</div>
          </div>
        ))}
      </div>

      <div style={cardStyle}>
        <div style={{ fontSize: '14px', fontWeight: '500', color: '#111827', marginBottom: '12px' }}>Session history</div>
        {workouts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af', fontSize: '14px' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>🏋️</div>
            Log your first workout to see progress here.
          </div>
        ) : (
          workouts.slice().reverse().map((w, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '12px 0', borderBottom: i < workouts.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
              <div>
                <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '99px', background: w.split.startsWith('Upper') ? '#EFF6FF' : '#F5F3FF', color: w.split.startsWith('Upper') ? '#1D4ED8' : '#6D28D9', fontWeight: '500' }}>{w.split}</span>
                <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '5px' }}>{w.date} · {w.exercises.length} exercises</div>
                {w.notes && <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '3px', fontStyle: 'italic' }}>"{w.notes}"</div>}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                {w.exercises.slice(0, 2).map((ex, j) => (
                  <div key={j} style={{ fontSize: '11px', color: '#9ca3af' }}>{ex.weight > 0 ? `${ex.weight}kg` : 'BW'} × {ex.sets}×{ex.reps}</div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
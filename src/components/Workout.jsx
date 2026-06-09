import { useState } from 'react';

const splits = {
  'Upper A': ['Incline bench press', 'Lat pulldown', 'Barbell row', 'Tricep pushdown', 'Barbell curl'],
  'Upper B': ['Overhead press', 'Cable row', 'Face pull', 'Hammer curl', 'Skull crusher'],
  'Lower A': ['Barbell squat', 'Leg press', 'Walking lunge', 'Calf raise', 'Leg extension'],
  'Lower B': ['Romanian deadlift', 'Hip thrust', 'Leg curl', 'Single leg RDL', 'Seated calf raise']
};

const splitColors = {
  'Upper A': { bg: '#EFF6FF', color: '#1D4ED8', border: '#BFDBFE' },
  'Upper B': { bg: '#EFF6FF', color: '#1D4ED8', border: '#BFDBFE' },
  'Lower A': { bg: '#F5F3FF', color: '#6D28D9', border: '#DDD6FE' },
  'Lower B': { bg: '#F5F3FF', color: '#6D28D9', border: '#DDD6FE' }
};

const splitIcons = {
  'Upper A': (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 4v16M18 4v16M3 8h4M17 8h4M3 16h4M17 16h4"/>
    </svg>
  ),
  'Upper B': (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 4v16M18 4v16M3 8h4M17 8h4M3 16h4M17 16h4"/>
    </svg>
  ),
  'Lower A': (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 4v7l3 3-3 3v3M11 4v7l-3 3 3 3v3"/>
    </svg>
  ),
  'Lower B': (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 4v7l3 3-3 3v3M11 4v7l-3 3 3 3v3"/>
    </svg>
  )
};

export default function Workout({ user }) {
  const [currentSplit, setCurrentSplit] = useState(null);
  const [sets, setSets] = useState({});
  const [reps, setReps] = useState({});
  const [weights, setWeights] = useState({});
  const [notes, setNotes] = useState('');
  const [saved, setSaved] = useState(false);

  const selectSplit = (split) => {
    setCurrentSplit(split);
    setSaved(false);
    setNotes('');
    setSets({});
    setReps({});
    setWeights({});
  };

  const saveWorkout = () => {
    const exercises = splits[currentSplit].map((ex, i) => ({
      name: ex,
      sets: parseInt(sets[i]) || 3,
      reps: parseInt(reps[i]) || 8,
      weight: parseFloat(weights[i]) || 0
    }));

    const workout = {
      split: currentSplit,
      date: new Date().toLocaleDateString('en-GB'),
      notes,
      exercises,
      timestamp: Date.now()
    };

    const key = 'ft_data_' + user.email;
    const existing = JSON.parse(localStorage.getItem(key) || '{}');
    const workouts = existing.workouts || [];
    workouts.push(workout);
    localStorage.setItem(key, JSON.stringify({ ...existing, workouts }));
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setCurrentSplit(null);
    }, 1800);
  };

  if (!currentSplit) {
    return (
      <div style={{ padding: '1.5rem 1rem' }}>
        <div style={{ fontSize: '22px', fontWeight: '600', color: '#111827', letterSpacing: '-0.3px', marginBottom: '0.25rem' }}>Log workout</div>
        <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '1.5rem' }}>Pick your split for today</div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {Object.keys(splits).map(split => {
            const c = splitColors[split];
            return (
              <button key={split} onClick={() => selectSplit(split)}
                style={{ background: 'white', border: `1px solid ${c.border}`, borderRadius: '14px', padding: '1.25rem', cursor: 'pointer', textAlign: 'left', transition: 'transform 0.1s, box-shadow 0.1s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
                <div style={{ color: c.color, marginBottom: '10px' }}>{splitIcons[split]}</div>
                <div style={{ fontSize: '15px', fontWeight: '600', color: '#111827', marginBottom: '4px' }}>{split}</div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>{splits[split].slice(0, 3).join(' · ')}</div>
                <div style={{ display: 'inline-block', marginTop: '10px', fontSize: '11px', padding: '3px 10px', borderRadius: '99px', background: c.bg, color: c.color, fontWeight: '500' }}>
                  {split.startsWith('Upper') ? 'Upper body' : 'Lower body'}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }


  return (
    <div style={{ padding: '1.5rem 1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ fontSize: '22px', fontWeight: '600', color: '#111827', letterSpacing: '-0.3px' }}>{currentSplit}</div>
          <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '2px' }}>{splits[currentSplit].length} exercises</div>
        </div>
        <button onClick={() => setCurrentSplit(null)}
          style={{ background: '#f3f4f6', border: 'none', borderRadius: '8px', padding: '8px 14px', fontSize: '13px', color: '#374151', cursor: 'pointer', fontWeight: '500' }}>
          Change
        </button>
      </div>

      {splits[currentSplit].map((ex, i) => (
        <div key={i} style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '1rem 1.25rem', marginBottom: '10px' }}>
          <div style={{ fontSize: '14px', fontWeight: '500', color: '#111827', marginBottom: '12px' }}>{ex}</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
            {[['Sets', sets, setSets, '3'], ['Reps', reps, setReps, '8'], ['Weight (kg)', weights, setWeights, '0']].map(([label, state, setter, placeholder]) => (
              <div key={label}>
                <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '5px', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.3px' }}>{label}</div>
                <input type="number" min="0" placeholder={placeholder}
                  value={state[i] || ''}
                  onChange={e => setter(prev => ({ ...prev, [i]: e.target.value }))}
                  style={{ width: '100%', padding: '9px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '15px', textAlign: 'center', fontWeight: '500', outline: 'none', fontFamily: 'inherit' }} />
              </div>
            ))}
          </div>
        </div>
      ))}

      <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '1rem 1.25rem', marginBottom: '1rem' }}>
        <div style={{ fontSize: '14px', fontWeight: '500', color: '#111827', marginBottom: '10px' }}>Notes</div>
        <textarea value={notes} onChange={e => setNotes(e.target.value)}
          placeholder="How did it feel? Any PRs?"
          style={{ width: '100%', padding: '10px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', height: '80px', resize: 'none', fontFamily: 'inherit', outline: 'none', color: '#374151' }} />
      </div>

      {saved && (
        <div style={{ background: '#F0FDF4', color: '#166534', borderRadius: '8px', padding: '12px 14px', fontSize: '14px', marginBottom: '1rem', fontWeight: '500', textAlign: 'center' }}>
          Workout saved!
        </div>
      )}

      <button onClick={saveWorkout}
        style={{ width: '100%', padding: '13px', background: '#185FA5', color: 'white', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '500', cursor: 'pointer' }}>
        Save workout
      </button>
      <button onClick={() => setCurrentSplit(null)}
        style={{ width: '100%', padding: '11px', background: 'white', border: '1px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', color: '#6b7280', cursor: 'pointer', marginTop: '8px' }}>
        Cancel
      </button>
    </div>
  );
}
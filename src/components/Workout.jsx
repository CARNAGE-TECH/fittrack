import { useEffect, useState } from 'react';

const splits = {
  'Upper A': ['Incline bench press', 'Lat pulldown', 'Barbell row', 'Tricep pushdown', 'Barbell curl'],
  'Upper B': ['Overhead press', 'Cable row', 'Face pull', 'Hammer curl', 'Skull crusher'],
  'Lower A': ['Barbell squat', 'Leg press', 'Walking lunge', 'Calf raise', 'Leg extension'],
  'Lower B': ['Romanian deadlift', 'Hip thrust', 'Leg curl', 'Single leg RDL', 'Seated calf raise']
};

const splitColors = {
  'Upper A': { bg: '#EDE8DC', color: '#0A0A0A', border: '#D6CFBF' },
  'Upper B': { bg: '#EDE8DC', color: '#0A0A0A', border: '#D6CFBF' },
  'Lower A': { bg: '#E8E2D4', color: '#0A0A0A', border: '#D6CFBF' },
  'Lower B': { bg: '#E8E2D4', color: '#0A0A0A', border: '#D6CFBF' }
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

const getSavedData = (email) => JSON.parse(localStorage.getItem('ft_data_' + email) || '{}');

const getBestWeight = (workouts, exerciseName) => workouts.reduce((best, workout) => {
  const match = workout.exercises?.find(ex => ex.name === exerciseName);
  return Math.max(best, match?.weight || 0);
}, 0);

export default function Workout({ user }) {
  const [currentSplit, setCurrentSplit] = useState(null);
  const [sets, setSets] = useState({});
  const [reps, setReps] = useState({});
  const [weights, setWeights] = useState({});
  const [notes, setNotes] = useState('');
  const [saved, setSaved] = useState(false);
  const [restSeconds, setRestSeconds] = useState(0);

  useEffect(() => {
    if (!restSeconds) return undefined;
    const timer = setInterval(() => setRestSeconds(seconds => Math.max(0, seconds - 1)), 1000);
    return () => clearInterval(timer);
  }, [restSeconds]);

  const selectSplit = (split) => {
    const savedData = getSavedData(user.email);
    const lastWorkout = [...(savedData.workouts || [])].reverse().find(w => w.split === split);
    const nextSets = {}, nextReps = {}, nextWeights = {};
    splits[split].forEach((exercise, i) => {
      const previous = lastWorkout?.exercises?.find(ex => ex.name === exercise);
      if (previous) { nextSets[i] = previous.sets; nextReps[i] = previous.reps; nextWeights[i] = previous.weight; }
    });
    setCurrentSplit(split); setSaved(false); setNotes('');
    setSets(nextSets); setReps(nextReps); setWeights(nextWeights);
  };

  const saveWorkout = () => {
    const key = 'ft_data_' + user.email;
    const existing = getSavedData(user.email);
    const workouts = existing.workouts || [];
    const exercises = splits[currentSplit].map((ex, i) => {
      const weight = parseFloat(weights[i]) || 0;
      return { name: ex, sets: parseInt(sets[i]) || 3, reps: parseInt(reps[i]) || 8, weight, isPr: weight > 0 && weight > getBestWeight(workouts, ex) };
    });
    const workout = { id: Date.now().toString(), split: currentSplit, date: new Date().toLocaleDateString('en-GB'), notes, exercises, timestamp: Date.now() };
    localStorage.setItem(key, JSON.stringify({ ...existing, workouts: [...workouts, workout] }));
    setSaved(true); setRestSeconds(0);
    setTimeout(() => { setSaved(false); setCurrentSplit(null); }, 1800);
  };

  const timerLabel = `${Math.floor(restSeconds / 60)}:${String(restSeconds % 60).padStart(2, '0')}`;

  if (!currentSplit) {
    return (
      <div style={{ padding: '1.5rem 1rem', background: '#F5F0E8', minHeight: '100vh' }}>
        <div style={{ fontSize: '22px', fontWeight: '600', color: '#0A0A0A', letterSpacing: '-0.3px', marginBottom: '0.25rem' }}>Log workout</div>
        <div style={{ fontSize: '14px', color: '#6B6258', marginBottom: '1.5rem' }}>Pick your split for today</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          {Object.keys(splits).map(split => {
            const c = splitColors[split];
            return (
              <button key={split} onClick={() => selectSplit(split)}
                style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: '14px', padding: '1.25rem', cursor: 'pointer', textAlign: 'left', transition: 'transform 0.1s, box-shadow 0.1s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.12)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
                <div style={{ color: c.color, marginBottom: '10px' }}>{splitIcons[split]}</div>
                <div style={{ fontSize: '15px', fontWeight: '600', color: '#0A0A0A', marginBottom: '4px' }}>{split}</div>
                <div style={{ fontSize: '12px', color: '#6B6258' }}>{splits[split].slice(0, 3).join(' / ')}</div>
                <div style={{ display: 'inline-block', marginTop: '10px', fontSize: '11px', padding: '3px 10px', borderRadius: '99px', background: '#0A0A0A', color: '#F5F0E8', fontWeight: '500' }}>
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
    <div style={{ padding: '1.5rem 1rem', background: '#F5F0E8', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ fontSize: '22px', fontWeight: '600', color: '#0A0A0A', letterSpacing: '-0.3px' }}>{currentSplit}</div>
          <div style={{ fontSize: '13px', color: '#6B6258', marginTop: '2px' }}>{splits[currentSplit].length} exercises</div>
        </div>
        <button onClick={() => setCurrentSplit(null)}
          style={{ background: '#EDE8DC', border: '1px solid #D6CFBF', borderRadius: '8px', padding: '8px 14px', fontSize: '13px', color: '#4A4035', cursor: 'pointer', fontWeight: '500' }}>
          Change
        </button>
      </div>

      {/* Rest timer */}
      <div style={{ background: '#EDE8DC', border: '1px solid #D6CFBF', borderRadius: '12px', padding: '1rem 1.25rem', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
        <div>
          <div style={{ fontSize: '14px', fontWeight: '500', color: '#0A0A0A' }}>Rest timer</div>
          <div style={{ fontSize: '26px', fontWeight: '600', color: restSeconds ? '#0A0A0A' : '#B0A898', marginTop: '2px' }}>{timerLabel}</div>
        </div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          {[60, 90, 120].map(seconds => (
            <button key={seconds} onClick={() => setRestSeconds(seconds)}
              style={{ padding: '8px 10px', border: '1px solid #D6CFBF', borderRadius: '8px', background: '#F5F0E8', color: '#4A4035', fontSize: '12px', fontWeight: '500', cursor: 'pointer' }}>
              {seconds}s
            </button>
          ))}
          <button onClick={() => setRestSeconds(0)}
            style={{ padding: '8px 10px', border: 'none', borderRadius: '8px', background: '#D6CFBF', color: '#4A4035', fontSize: '12px', fontWeight: '500', cursor: 'pointer' }}>
            Reset
          </button>
        </div>
      </div>

      {splits[currentSplit].map((ex, i) => (
        <div key={i} style={{ background: '#EDE8DC', border: '1px solid #D6CFBF', borderRadius: '12px', padding: '1rem 1.25rem', marginBottom: '10px' }}>
          <div style={{ fontSize: '14px', fontWeight: '500', color: '#0A0A0A', marginBottom: '12px' }}>{ex}</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
            {[['Sets', sets, setSets, '3'], ['Reps', reps, setReps, '8'], ['Weight (kg)', weights, setWeights, '0']].map(([label, state, setter, placeholder]) => (
              <div key={label}>
                <div style={{ fontSize: '11px', color: '#8A7F6F', marginBottom: '5px', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.3px' }}>{label}</div>
                <input type="number" min="0" placeholder={placeholder}
                  value={state[i] || ''}
                  onChange={e => setter(prev => ({ ...prev, [i]: e.target.value }))}
                  style={{ width: '100%', padding: '9px', border: '1px solid #D6CFBF', borderRadius: '8px', fontSize: '15px', textAlign: 'center', fontWeight: '500', outline: 'none', fontFamily: 'inherit', background: '#F5F0E8', color: '#0A0A0A' }} />
              </div>
            ))}
          </div>
        </div>
      ))}

      <div style={{ background: '#EDE8DC', border: '1px solid #D6CFBF', borderRadius: '12px', padding: '1rem 1.25rem', marginBottom: '1rem' }}>
        <div style={{ fontSize: '14px', fontWeight: '500', color: '#0A0A0A', marginBottom: '10px' }}>Notes</div>
        <textarea value={notes} onChange={e => setNotes(e.target.value)}
          placeholder="How did it feel? Any PRs?"
          style={{ width: '100%', padding: '10px', border: '1px solid #D6CFBF', borderRadius: '8px', fontSize: '14px', height: '80px', resize: 'none', fontFamily: 'inherit', outline: 'none', color: '#0A0A0A', background: '#F5F0E8' }} />
      </div>

      {saved && (
        <div style={{ background: 'rgba(45,90,45,0.12)', color: '#2D5A2D', borderRadius: '8px', padding: '12px 14px', fontSize: '14px', marginBottom: '1rem', fontWeight: '500', textAlign: 'center' }}>
          Workout saved!
        </div>
      )}

      <button onClick={saveWorkout}
        style={{ width: '100%', padding: '13px', background: '#0A0A0A', color: '#F5F0E8', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '500', cursor: 'pointer' }}>
        Save workout
      </button>
      <button onClick={() => setCurrentSplit(null)}
        style={{ width: '100%', padding: '11px', background: '#EDE8DC', border: '1px solid #D6CFBF', borderRadius: '10px', fontSize: '14px', color: '#6B6258', cursor: 'pointer', marginTop: '8px' }}>
        Cancel
      </button>
    </div>
  );
}
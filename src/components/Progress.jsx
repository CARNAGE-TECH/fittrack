import { useState, useEffect } from 'react';

const splitOptions = ['Upper A', 'Lower A', 'Upper B', 'Lower B'];

const getWorkoutKey = (workout, index) => workout.id || String(workout.timestamp || index);

export default function Progress({ user }) {
  const [workouts, setWorkouts] = useState([]);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    const key = 'ft_data_' + user.email;
    const saved = JSON.parse(localStorage.getItem(key) || '{}');
    setWorkouts(saved.workouts || []);
  }, [user]);

  const saveWorkouts = (nextWorkouts) => {
    const key = 'ft_data_' + user.email;
    const saved = JSON.parse(localStorage.getItem(key) || '{}');
    localStorage.setItem(key, JSON.stringify({ ...saved, workouts: nextWorkouts }));
    setWorkouts(nextWorkouts);
  };

  const startEdit = (workout, index) => {
    setEditing({
      key: getWorkoutKey(workout, index),
      split: workout.split,
      date: workout.date,
      notes: workout.notes || '',
      exercises: workout.exercises.map(ex => ({ ...ex }))
    });
  };

  const updateExercise = (index, field, value) => {
    setEditing(current => ({
      ...current,
      exercises: current.exercises.map((ex, i) => i === index ? { ...ex, [field]: value } : ex)
    }));
  };

  const saveEdit = () => {
    const nextWorkouts = workouts.map((workout, index) => {
      if (getWorkoutKey(workout, index) !== editing.key) return workout;
      return {
        ...workout,
        split: editing.split,
        date: editing.date,
        notes: editing.notes,
        exercises: editing.exercises.map(ex => ({
          ...ex,
          sets: parseInt(ex.sets) || 0,
          reps: parseInt(ex.reps) || 0,
          weight: parseFloat(ex.weight) || 0
        }))
      };
    });
    saveWorkouts(nextWorkouts);
    setEditing(null);
  };

  const deleteWorkout = (workout, index) => {
    if (!window.confirm('Delete this workout session?')) return;
    const targetKey = getWorkoutKey(workout, index);
    saveWorkouts(workouts.filter((item, i) => getWorkoutKey(item, i) !== targetKey));
  };

  const upper = workouts.filter(w => w.split.startsWith('Upper')).length;
  const lower = workouts.filter(w => w.split.startsWith('Lower')).length;

  const cardStyle = {
    background: 'white', border: '1px solid #e5e7eb',
    borderRadius: '12px', padding: '1rem 1.25rem', marginBottom: '1rem'
  };

  const inputStyle = {
    width: '100%', padding: '8px 10px', border: '1px solid #e5e7eb',
    borderRadius: '8px', fontSize: '13px', outline: 'none', fontFamily: 'inherit'
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

      {editing && (
        <div style={cardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827' }}>Edit session</div>
            <button onClick={() => setEditing(null)}
              style={{ background: '#f3f4f6', border: 'none', borderRadius: '8px', padding: '7px 10px', fontSize: '12px', color: '#6b7280', cursor: 'pointer' }}>
              Close
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', color: '#6b7280', display: 'block', marginBottom: '5px' }}>Split</label>
              <select value={editing.split} onChange={e => setEditing({ ...editing, split: e.target.value })} style={inputStyle}>
                {splitOptions.map(split => <option key={split}>{split}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: '12px', color: '#6b7280', display: 'block', marginBottom: '5px' }}>Date</label>
              <input value={editing.date} onChange={e => setEditing({ ...editing, date: e.target.value })} style={inputStyle} />
            </div>
          </div>

          {editing.exercises.map((ex, i) => (
            <div key={`${ex.name}-${i}`} style={{ borderTop: '1px solid #f3f4f6', paddingTop: '10px', marginTop: '10px' }}>
              <div style={{ fontSize: '13px', fontWeight: '500', color: '#111827', marginBottom: '8px' }}>{ex.name}</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                {['sets', 'reps', 'weight'].map(field => (
                  <input key={field} type="number" min="0" value={ex[field]}
                    aria-label={`${ex.name} ${field}`}
                    onChange={e => updateExercise(i, field, e.target.value)}
                    style={inputStyle} />
                ))}
              </div>
            </div>
          ))}

          <label style={{ fontSize: '12px', color: '#6b7280', display: 'block', margin: '12px 0 5px' }}>Notes</label>
          <textarea value={editing.notes} onChange={e => setEditing({ ...editing, notes: e.target.value })}
            style={{ ...inputStyle, minHeight: '70px', resize: 'vertical' }} />

          <button onClick={saveEdit}
            style={{ width: '100%', padding: '12px', background: '#185FA5', color: 'white', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', marginTop: '12px' }}>
            Save changes
          </button>
        </div>
      )}

      <div style={cardStyle}>
        <div style={{ fontSize: '14px', fontWeight: '500', color: '#111827', marginBottom: '12px' }}>Session history</div>
        {workouts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#9ca3af', fontSize: '14px' }}>
            Log your first workout to see progress here.
          </div>
        ) : (
          workouts.slice().reverse().map((w, reverseIndex) => {
            const originalIndex = workouts.length - 1 - reverseIndex;
            return (
              <div key={getWorkoutKey(w, originalIndex)} style={{ padding: '12px 0', borderBottom: reverseIndex < workouts.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                  <div>
                    <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '99px', background: w.split.startsWith('Upper') ? '#EFF6FF' : '#F5F3FF', color: w.split.startsWith('Upper') ? '#1D4ED8' : '#6D28D9', fontWeight: '500' }}>{w.split}</span>
                    <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '5px' }}>{w.date} / {w.exercises.length} exercises</div>
                    {w.notes && <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '3px', fontStyle: 'italic' }}>"{w.notes}"</div>}
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button onClick={() => startEdit(w, originalIndex)}
                      style={{ background: '#EFF6FF', border: 'none', borderRadius: '6px', padding: '6px 9px', cursor: 'pointer', color: '#185FA5', fontSize: '12px', fontWeight: '500' }}>
                      Edit
                    </button>
                    <button onClick={() => deleteWorkout(w, originalIndex)}
                      style={{ background: '#FEF2F2', border: 'none', borderRadius: '6px', padding: '6px 9px', cursor: 'pointer', color: '#DC2626', fontSize: '12px', fontWeight: '500' }}>
                      Delete
                    </button>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 10px', marginTop: '10px' }}>
                  {w.exercises.map((ex, j) => (
                    <div key={`${ex.name}-${j}`} style={{ fontSize: '11px', color: '#9ca3af' }}>
                      <span style={{ color: '#6b7280' }}>{ex.name}:</span> {ex.weight > 0 ? `${ex.weight}kg` : 'BW'} x {ex.sets}x{ex.reps}
                      {ex.isPr && <span style={{ marginLeft: '5px', color: '#16a34a', fontWeight: '600' }}>PR</span>}
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

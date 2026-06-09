import { useState, useEffect } from 'react';

export default function Macros({ user }) {
  const [tab, setTab] = useState('log');
  const [foodLog, setFoodLog] = useState([]);
  const [goals, setGoals] = useState({ cal: 2200, pro: 180, carb: 200, fat: 70 });
  const [totals, setTotals] = useState({ cal: 0, pro: 0, carb: 0, fat: 0 });
  const [food, setFood] = useState({ name: '', cal: '', pro: '', carb: '', fat: '' });
  const [goalInputs, setGoalInputs] = useState({ cal: 2200, pro: 180, carb: 200, fat: 70 });
  const [foodSaved, setFoodSaved] = useState(false);
  const [goalSaved, setGoalSaved] = useState(false);

  useEffect(() => {
    const key = 'ft_data_' + user.email;
    const saved = JSON.parse(localStorage.getItem(key) || '{}');
    const today = new Date().toDateString();
    const log = (saved.foodLog || []).filter(f => f.date === today);
    const g = saved.goals || { cal: 2200, pro: 180, carb: 200, fat: 70 };
    setFoodLog(log);
    setGoals(g);
    setGoalInputs(g);
    calcTotals(log);
  }, [user]);

  const calcTotals = (log) => {
    const t = log.reduce((acc, f) => ({
      cal: acc.cal + f.cal, pro: acc.pro + f.pro,
      carb: acc.carb + f.carb, fat: acc.fat + f.fat
    }), { cal: 0, pro: 0, carb: 0, fat: 0 });
    setTotals(t);
  };

  const saveToStorage = (log, g) => {
    const key = 'ft_data_' + user.email;
    const existing = JSON.parse(localStorage.getItem(key) || '{}');
    const today = new Date().toDateString();
    const otherDays = (existing.foodLog || []).filter(f => f.date !== today);
    localStorage.setItem(key, JSON.stringify({ ...existing, foodLog: [...otherDays, ...log], goals: g }));
  };

  const addFood = () => {
    if (!food.name) return;
    const entry = {
      name: food.name,
      cal: parseInt(food.cal) || 0,
      pro: parseInt(food.pro) || 0,
      carb: parseInt(food.carb) || 0,
      fat: parseInt(food.fat) || 0,
      date: new Date().toDateString(),
      time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
    };
    const newLog = [...foodLog, entry];
    setFoodLog(newLog);
    calcTotals(newLog);
    saveToStorage(newLog, goals);
    setFood({ name: '', cal: '', pro: '', carb: '', fat: '' });
    setFoodSaved(true);
    setTimeout(() => setFoodSaved(false), 1500);
  };

  const removeFood = (i) => {
    const newLog = foodLog.filter((_, idx) => idx !== i);
    setFoodLog(newLog);
    calcTotals(newLog);
    saveToStorage(newLog, goals);
  };

  const saveGoals = () => {
    const g = {
      cal: parseInt(goalInputs.cal) || 2200,
      pro: parseInt(goalInputs.pro) || 180,
      carb: parseInt(goalInputs.carb) || 200,
      fat: parseInt(goalInputs.fat) || 70
    };
    setGoals(g);
    saveToStorage(foodLog, g);
    setGoalSaved(true);
    setTimeout(() => setGoalSaved(false), 1500);
  };

  const macros = [
    { label: 'Calories', key: 'cal', unit: '', color: '#185FA5', bg: '#EFF6FF' },
    { label: 'Protein', key: 'pro', unit: 'g', color: '#6D28D9', bg: '#F5F3FF' },
    { label: 'Carbs', key: 'carb', unit: 'g', color: '#B45309', bg: '#FFFBEB' },
    { label: 'Fat', key: 'fat', unit: 'g', color: '#065F46', bg: '#ECFDF5' }
  ];

  const inputStyle = {
    width: '100%', padding: '10px 12px', border: '1px solid #e5e7eb',
    borderRadius: '8px', fontSize: '14px', outline: 'none', fontFamily: 'inherit'
  };

  return (
    <div style={{ padding: '1.5rem 1rem' }}>
      <div style={{ fontSize: '22px', fontWeight: '600', color: '#111827', letterSpacing: '-0.3px', marginBottom: '0.25rem' }}>Macros</div>
      <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '1.5rem' }}>Track today's nutrition</div>

      <div style={{ display: 'flex', gap: '6px', marginBottom: '1.25rem' }}>
        {['log', 'goals'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{ padding: '8px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: '500', border: '1px solid #e5e7eb', background: tab === t ? '#185FA5' : 'white', color: tab === t ? 'white' : '#6b7280', cursor: 'pointer', transition: 'all 0.15s' }}>
            {t === 'log' ? 'Log food' : 'My goals'}
          </button>
        ))}
      </div>

      {tab === 'log' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '1.25rem' }}>
            {macros.map(({ label, key, unit, color, bg }) => (
              <div key={key} style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '1rem' }}>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '6px', fontWeight: '500' }}>{label}</div>
                <div style={{ fontSize: '22px', fontWeight: '600', color }}>{totals[key]}{unit}</div>
                <div style={{ background: '#f3f4f6', borderRadius: '99px', height: '5px', marginTop: '10px', overflow: 'hidden' }}>
                  <div style={{ width: Math.min(100, Math.round(totals[key] / goals[key] * 100)) + '%', height: '100%', background: color, borderRadius: '99px', transition: 'width 0.4s' }} />
                </div>
                <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '5px' }}>of {goals[key]}{unit}</div>
              </div>
            ))}
          </div>

          <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '1rem 1.25rem', marginBottom: '1rem' }}>
            <div style={{ fontSize: '14px', fontWeight: '500', color: '#111827', marginBottom: '12px' }}>Add food</div>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ fontSize: '13px', color: '#6b7280', display: 'block', marginBottom: '6px', fontWeight: '500' }}>Food name</label>
              <input value={food.name} onChange={e => setFood({ ...food, name: e.target.value })}
                placeholder="e.g. Grilled chicken frank" style={inputStyle} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {macros.map(({ label, key }) => (
                <div key={key}>
                  <label style={{ fontSize: '13px', color: '#6b7280', display: 'block', marginBottom: '6px', fontWeight: '500' }}>{label}</label>
                  <input type="number" min="0" value={food[key]} onChange={e => setFood({ ...food, [key]: e.target.value })}
                    placeholder="0" style={inputStyle} />
                </div>
              ))}
            </div>
            {foodSaved && (
              <div style={{ background: '#F0FDF4', color: '#166534', borderRadius: '8px', padding: '10px', fontSize: '14px', marginTop: '10px', fontWeight: '500', textAlign: 'center' }}>
                Food added!
              </div>
            )}
            <button onClick={addFood}
              style={{ width: '100%', padding: '12px', background: '#185FA5', color: 'white', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '500', cursor: 'pointer', marginTop: '1rem' }}>
              Add food
            </button>
          </div>

          <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '1rem 1.25rem' }}>
            <div style={{ fontSize: '14px', fontWeight: '500', color: '#111827', marginBottom: '12px' }}>Today's log</div>
            {foodLog.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '1.5rem', color: '#9ca3af', fontSize: '14px' }}>
                Nothing logged yet today.
              </div>
            ) : (
              foodLog.map((f, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < foodLog.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>{f.name}</div>
                    <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>{f.cal} kcal · {f.pro}g protein · {f.time}</div>
                  </div>
                  <button onClick={() => removeFood(i)}
                    style={{ background: '#FEF2F2', border: 'none', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer', color: '#DC2626', fontSize: '12px', fontWeight: '500' }}>
                    Remove
                  </button>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {tab === 'goals' && (
        <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '1rem 1.25rem' }}>
          <div style={{ fontSize: '14px', fontWeight: '500', color: '#111827', marginBottom: '12px' }}>Daily targets</div>
          {macros.map(({ label, key }) => (
            <div key={key} style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '13px', color: '#6b7280', display: 'block', marginBottom: '6px', fontWeight: '500' }}>{label}</label>
              <input type="number" value={goalInputs[key]} onChange={e => setGoalInputs({ ...goalInputs, [key]: e.target.value })}
                style={inputStyle} />
            </div>
          ))}
          {goalSaved && (
            <div style={{ background: '#F0FDF4', color: '#166534', borderRadius: '8px', padding: '10px', fontSize: '14px', marginBottom: '10px', fontWeight: '500', textAlign: 'center' }}>
              Goals saved!
            </div>
          )}
          <button onClick={saveGoals}
            style={{ width: '100%', padding: '12px', background: '#185FA5', color: 'white', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '500', cursor: 'pointer' }}>
            Save goals
          </button>
        </div>
      )}
    </div>
  );
}
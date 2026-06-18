import { useState, useEffect, useRef } from 'react';

const API_KEY = process.env.REACT_APP_USDA_API_KEY || 'swXL8cEjkNFIuzbY6Sm5s7sMfLAyXXbQWbku0EZS';
const defaultGoals = { cal: 2200, pro: 180, carb: 200, fat: 70 };
const getProgressPct = (total, goal) => goal > 0 ? Math.min(100, Math.round(total / goal * 100)) : 0;

export default function Macros({ user }) {
  const [tab, setTab] = useState('log');
  const [inputMode, setInputMode] = useState('search');
  const [foodLog, setFoodLog] = useState([]);
  const [goals, setGoals] = useState(defaultGoals);
  const [totals, setTotals] = useState({ cal: 0, pro: 0, carb: 0, fat: 0 });
  const [goalInputs, setGoalInputs] = useState(defaultGoals);
  const [goalSaved, setGoalSaved] = useState(false);

  // Search mode
  const [query, setQuery] = useState('');
  const [portion, setPortion] = useState('100');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [searchError, setSearchError] = useState('');
  const debounceRef = useRef(null);

  // Manual mode
  const [manual, setManual] = useState({ name: '', cal: '', pro: '', carb: '', fat: '' });

  const [foodSaved, setFoodSaved] = useState(false);

  useEffect(() => {
    const key = 'ft_data_' + user.email;
    const saved = JSON.parse(localStorage.getItem(key) || '{}');
    const today = new Date().toDateString();
    const log = (saved.foodLog || []).filter(f => f.date === today);
    const g = saved.goals || defaultGoals;
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

  const searchFood = async (q) => {
    if (!q || q.length < 2) { setResults([]); return; }
    setSearching(true);
    setSearchError('');
    try {
      const res = await fetch(`https://api.nal.usda.gov/fdc/v1/foods/search?query=${encodeURIComponent(q)}&pageSize=6&api_key=${API_KEY}`);
      const data = await res.json();
      setResults(data.foods || []);
    } catch {
      setSearchError('Could not search foods. Check your connection.');
    }
    setSearching(false);
  };

  const handleQueryChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    setSelectedFood(null);
    setResults([]);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => searchFood(val), 500);
  };

  const getNutrient = (food, id) => {
    const n = food.foodNutrients?.find(n => n.nutrientId === id);
    return n?.value || 0;
  };

  const selectFood = (food) => {
    setSelectedFood(food);
    setQuery(food.description);
    setResults([]);
  };

  const addSearchFood = () => {
    if (!selectedFood) return;
    const p = parseFloat(portion) || 100;
    const factor = p / 100;
    const entry = {
      name: selectedFood.description.length > 40 ? selectedFood.description.slice(0, 40) + '...' : selectedFood.description,
      cal: Math.round(getNutrient(selectedFood, 1008) * factor),
      pro: Math.round(getNutrient(selectedFood, 1003) * factor),
      carb: Math.round(getNutrient(selectedFood, 1005) * factor),
      fat: Math.round(getNutrient(selectedFood, 1004) * factor),
      portion: p,
      date: new Date().toDateString(),
      time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
    };
    const newLog = [...foodLog, entry];
    setFoodLog(newLog);
    calcTotals(newLog);
    saveToStorage(newLog, goals);
    setQuery('');
    setPortion('100');
    setSelectedFood(null);
    setResults([]);
    setFoodSaved(true);
    setTimeout(() => setFoodSaved(false), 1500);
  };

  const addManualFood = () => {
    if (!manual.name) return;
    const entry = {
      name: manual.name,
      cal: parseInt(manual.cal) || 0,
      pro: parseInt(manual.pro) || 0,
      carb: parseInt(manual.carb) || 0,
      fat: parseInt(manual.fat) || 0,
      portion: null,
      date: new Date().toDateString(),
      time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
    };
    const newLog = [...foodLog, entry];
    setFoodLog(newLog);
    calcTotals(newLog);
    saveToStorage(newLog, goals);
    setManual({ name: '', cal: '', pro: '', carb: '', fat: '' });
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

  const exportData = () => {
    const key = 'ft_data_' + user.email;
    const data = localStorage.getItem(key) || '{}';
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fittrack-${user.email.replace(/[^a-z0-9]/gi, '-')}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importData = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        const nextData = {
          workouts: Array.isArray(parsed.workouts) ? parsed.workouts : [],
          foodLog: Array.isArray(parsed.foodLog) ? parsed.foodLog : [],
          goals: parsed.goals || defaultGoals
        };
        localStorage.setItem('ft_data_' + user.email, JSON.stringify(nextData));
        const today = new Date().toDateString();
        const log = nextData.foodLog.filter(f => f.date === today);
        setFoodLog(log);
        setGoals(nextData.goals);
        setGoalInputs(nextData.goals);
        calcTotals(log);
      } catch {
        alert('That file is not valid FitTrack JSON.');
      }
      event.target.value = '';
    };
    reader.readAsText(file);
  };

  const macros = [
    { label: 'Calories', key: 'cal', unit: '', color: '#185FA5' },
    { label: 'Protein', key: 'pro', unit: 'g', color: '#6D28D9' },
    { label: 'Carbs', key: 'carb', unit: 'g', color: '#B45309' },
    { label: 'Fat', key: 'fat', unit: 'g', color: '#065F46' }
  ];

  const inputStyle = {
    width: '100%', padding: '10px 12px', border: '1px solid #e5e7eb',
    borderRadius: '8px', fontSize: '14px', outline: 'none', fontFamily: 'inherit'
  };

  return (
    <div style={{ padding: '1.5rem 1rem' }}>
      <div style={{ fontSize: '22px', fontWeight: '600', color: '#111827', letterSpacing: '-0.3px', marginBottom: '0.25rem' }}>Macros</div>
      <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '1.5rem' }}>Track today's nutrition</div>

      {/* Main tabs */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '1.25rem' }}>
        {['log', 'goals'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{ padding: '8px 18px', borderRadius: '8px', fontSize: '13px', fontWeight: '500', border: '1px solid #e5e7eb', background: tab === t ? '#185FA5' : 'white', color: tab === t ? 'white' : '#6b7280', cursor: 'pointer' }}>
            {t === 'log' ? 'Log food' : 'My goals'}
          </button>
        ))}
      </div>

      {tab === 'log' && (
        <>
          {/* Macro summary cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '1.25rem' }}>
            {macros.map(({ label, key, unit, color }) => (
              <div key={key} style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '1rem' }}>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '6px', fontWeight: '500' }}>{label}</div>
                <div style={{ fontSize: '22px', fontWeight: '600', color }}>{totals[key]}{unit}</div>
                <div style={{ background: '#f3f4f6', borderRadius: '99px', height: '5px', marginTop: '10px', overflow: 'hidden' }}>
                  <div style={{ width: getProgressPct(totals[key], goals[key]) + '%', height: '100%', background: color, borderRadius: '99px', transition: 'width 0.4s' }} />
                </div>
                <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '5px' }}>of {goals[key]}{unit}</div>
              </div>
            ))}
          </div>

          {/* Input mode toggle */}
          <div style={{ display: 'flex', background: '#f3f4f6', borderRadius: '10px', padding: '4px', marginBottom: '1rem' }}>
            {[['search', 'Search food'], ['manual', 'Enter manually']].map(([mode, label]) => (
              <button key={mode} onClick={() => setInputMode(mode)}
                style={{ flex: 1, padding: '8px', borderRadius: '7px', border: 'none', fontSize: '13px', fontWeight: '500', cursor: 'pointer', background: inputMode === mode ? 'white' : 'transparent', color: inputMode === mode ? '#111827' : '#6b7280', boxShadow: inputMode === mode ? '0 1px 3px rgba(0,0,0,0.1)' : 'none', transition: 'all 0.15s' }}>
                {label}
              </button>
            ))}
          </div>

          {/* Search mode */}
          {inputMode === 'search' && (
            <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '1rem 1.25rem', marginBottom: '1rem' }}>
              <div style={{ fontSize: '14px', fontWeight: '500', color: '#111827', marginBottom: '12px' }}>Search food database</div>

              <div style={{ marginBottom: '10px' }}>
                <input value={query} onChange={handleQueryChange}
                  placeholder="e.g. grilled chicken breast"
                  style={inputStyle} />
                {searching && <div style={{ fontSize: '13px', color: '#9ca3af', marginTop: '6px' }}>Searching...</div>}
                {searchError && <div style={{ fontSize: '13px', color: '#DC2626', marginTop: '6px' }}>{searchError}</div>}
                {results.length > 0 && (
                  <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', marginTop: '6px', overflow: 'hidden' }}>
                    {results.map((food, i) => (
                      <div key={i} onClick={() => selectFood(food)}
                        style={{ padding: '10px 12px', fontSize: '13px', cursor: 'pointer', borderBottom: i < results.length - 1 ? '1px solid #f3f4f6' : 'none', background: 'white' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'}
                        onMouseLeave={e => e.currentTarget.style.background = 'white'}>
                        <div style={{ fontWeight: '500', color: '#111827' }}>{food.description.length > 50 ? food.description.slice(0, 50) + '...' : food.description}</div>
                        <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>
                          {Math.round(getNutrient(food, 1008))} kcal / {Math.round(getNutrient(food, 1003))}g protein per 100g
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {selectedFood && (
                <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '8px', padding: '10px 12px', marginBottom: '10px' }}>
                  <div style={{ fontSize: '13px', fontWeight: '500', color: '#166534', marginBottom: '8px' }}>Selected - per 100g</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', fontSize: '12px', textAlign: 'center' }}>
                    {[['Kcal', 1008], ['Protein', 1003], ['Carbs', 1005], ['Fat', 1004]].map(([label, id]) => (
                      <div key={id} style={{ background: 'white', borderRadius: '6px', padding: '6px' }}>
                        <div style={{ fontWeight: '600', color: '#111827' }}>{Math.round(getNutrient(selectedFood, id))}</div>
                        <div style={{ color: '#6b7280' }}>{label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ marginBottom: '10px' }}>
                <label style={{ fontSize: '13px', color: '#6b7280', display: 'block', marginBottom: '6px', fontWeight: '500' }}>Portion size (grams)</label>
                <input type="number" min="1" value={portion} onChange={e => setPortion(e.target.value)}
                  placeholder="100" style={{ ...inputStyle, width: '100%' }} />
              </div>

              {foodSaved && (
                <div style={{ background: '#F0FDF4', color: '#166534', borderRadius: '8px', padding: '10px', fontSize: '14px', marginBottom: '10px', fontWeight: '500', textAlign: 'center' }}>
                  Food added!
                </div>
              )}

              <button onClick={addSearchFood} disabled={!selectedFood}
                style={{ width: '100%', padding: '12px', background: selectedFood ? '#185FA5' : '#9ca3af', color: 'white', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '500', cursor: selectedFood ? 'pointer' : 'not-allowed' }}>
                Add food
              </button>
            </div>
          )}

          {/* Manual mode */}
          {inputMode === 'manual' && (
            <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '1rem 1.25rem', marginBottom: '1rem' }}>
              <div style={{ fontSize: '14px', fontWeight: '500', color: '#111827', marginBottom: '4px' }}>Enter food manually</div>
              <div style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '12px' }}>For Nigerian & local foods not in the database</div>

              <div style={{ marginBottom: '10px' }}>
                <label style={{ fontSize: '13px', color: '#6b7280', display: 'block', marginBottom: '6px', fontWeight: '500' }}>Food name</label>
                <input value={manual.name} onChange={e => setManual({ ...manual, name: e.target.value })}
                  placeholder="e.g. Jollof rice, Egusi soup"
                  style={inputStyle} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                {macros.map(({ label, key, unit }) => (
                  <div key={key}>
                    <label style={{ fontSize: '13px', color: '#6b7280', display: 'block', marginBottom: '6px', fontWeight: '500' }}>{label}{unit ? ` (${unit})` : ' (kcal)'}</label>
                    <input type="number" min="0" value={manual[key]} onChange={e => setManual({ ...manual, [key]: e.target.value })}
                      placeholder="0" style={inputStyle} />
                  </div>
                ))}
              </div>

              {foodSaved && (
                <div style={{ background: '#F0FDF4', color: '#166534', borderRadius: '8px', padding: '10px', fontSize: '14px', marginBottom: '10px', fontWeight: '500', textAlign: 'center' }}>
                  Food added!
                </div>
              )}

              <button onClick={addManualFood} disabled={!manual.name}
                style={{ width: '100%', padding: '12px', background: manual.name ? '#185FA5' : '#9ca3af', color: 'white', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: '500', cursor: manual.name ? 'pointer' : 'not-allowed' }}>
                Add food
              </button>
            </div>
          )}

          {/* Today's log */}
          <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '1rem 1.25rem' }}>
            <div style={{ fontSize: '14px', fontWeight: '500', color: '#111827', marginBottom: '12px' }}>Today's log</div>
            {foodLog.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '1.5rem', color: '#9ca3af', fontSize: '14px' }}>Nothing logged yet today.</div>
            ) : (
              foodLog.map((f, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < foodLog.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                  <div style={{ flex: 1, marginRight: '10px' }}>
                    <div style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>{f.name}</div>
                    <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>
                      {f.cal} kcal / {f.pro}g protein{f.portion ? ` / ${f.portion}g` : ''} / {f.time}
                    </div>
                  </div>
                  <button onClick={() => removeFood(i)}
                    style={{ background: '#FEF2F2', border: 'none', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer', color: '#DC2626', fontSize: '12px', fontWeight: '500', whiteSpace: 'nowrap' }}>
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

          <div style={{ borderTop: '1px solid #f3f4f6', marginTop: '1rem', paddingTop: '1rem' }}>
            <div style={{ fontSize: '14px', fontWeight: '500', color: '#111827', marginBottom: '8px' }}>Local data</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button onClick={exportData}
                style={{ width: '100%', padding: '11px', background: 'white', border: '1px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', color: '#374151', cursor: 'pointer', fontWeight: '500' }}>
                Export JSON
              </button>
              <label style={{ width: '100%', padding: '11px', background: 'white', border: '1px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', color: '#374151', cursor: 'pointer', fontWeight: '500', textAlign: 'center' }}>
                Import JSON
                <input type="file" accept="application/json" onChange={importData} style={{ display: 'none' }} />
              </label>
            </div>
            <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '8px', lineHeight: 1.4 }}>
              Export before clearing browser data or moving to another device.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

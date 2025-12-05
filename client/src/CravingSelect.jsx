import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const options = [
  { key: 'food', label: 'Food' },
  { key: 'sugar', label: 'Sugar' },
  { key: 'smoking', label: 'Smoking / Vaping' },
  { key: 'alcohol', label: 'Alcohol' },
  { key: 'spending', label: 'Spending' },
  { key: 'other', label: 'Other' },
]

function CravingSelect() {
  const [selected, setSelected] = useState(null)
  const navigate = useNavigate()

  return (
    <main style={styles.container}>
      <h2 style={styles.title}>What are you fighting right now?</h2>
      <div style={styles.grid}>
        {options.map((opt) => (
          <button
            key={opt.key}
            onClick={() => setSelected(opt.key)}
            style={{
              ...styles.option,
              ...(selected === opt.key ? styles.optionActive : {}),
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>
      <button
        style={{ ...styles.continue, opacity: selected ? 1 : 0.5 }}
        disabled={!selected}
        onClick={() =>
          navigate('/matching', {
            state: { craving: selected },
          })
        }
      >
        Continue
      </button>
    </main>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    padding: '2rem',
    alignItems: 'center',
  },
  title: { margin: 0 },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '0.75rem',
    width: '100%',
    maxWidth: 800,
  },
  option: {
    padding: '1rem',
    borderRadius: 12,
    border: '1px solid #cbd5e1',
    background: '#fff',
    cursor: 'pointer',
    textAlign: 'center',
  },
  optionActive: {
    borderColor: '#0ea5e9',
    boxShadow: '0 0 0 2px #bae6fd',
  },
  continue: {
    padding: '0.9rem 1.4rem',
    borderRadius: 10,
    border: 'none',
    background: '#0ea5e9',
    color: '#fff',
    cursor: 'pointer',
  },
}

export default CravingSelect

import { useNavigate } from 'react-router-dom'

function Home() {
  const navigate = useNavigate()

  return (
    <main style={styles.container}>
      <h1 style={styles.title}>Clutch</h1>
      <p style={styles.subtitle}>Real-time support for cravings.</p>
      <button style={styles.button} onClick={() => navigate('/craving')}>
        I need help right now
      </button>
    </main>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2rem',
    textAlign: 'center',
  },
  title: { fontSize: '2.5rem', margin: 0 },
  subtitle: { margin: 0, opacity: 0.8 },
  button: {
    padding: '0.9rem 1.4rem',
    fontSize: '1rem',
    borderRadius: 10,
    border: 'none',
    background: '#0ea5e9',
    color: '#fff',
    cursor: 'pointer',
  },
}

export default Home

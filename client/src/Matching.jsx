import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import socket from './socket'

function Matching() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const craving = state?.craving
  const [status, setStatus] = useState('Finding someone who gets it...')
  const [joined, setJoined] = useState(false)

  useEffect(() => {
    if (!craving) {
      navigate('/')
      return
    }

    // Connect if needed and emit join only once per mount to avoid double-join in StrictMode
    if (!socket.connected) socket.connect()
    if (!joined) {
      socket.emit('join_craving', { craving })
      setJoined(true)
    }

    const onWaiting = () => setStatus('Finding someone who gets it...')
    const onMatched = ({ roomId, craving: matchedCraving }) => {
      navigate('/chat', { state: { roomId, craving: matchedCraving } })
    }

    socket.on('waiting', onWaiting)
    socket.on('matched', onMatched)

    return () => {
      socket.off('waiting', onWaiting)
      socket.off('matched', onMatched)
    }
  }, [craving, navigate, joined])

  if (!craving) return null

  return (
    <main style={styles.container}>
      <h2>Matching for: {craving}</h2>
      <p>{status}</p>
    </main>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2rem',
  },
}

export default Matching

import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import socket from './socket'

function Chat() {
  const navigate = useNavigate()
  const { state } = useLocation()
  const roomId = state?.roomId
  const craving = state?.craving
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const bottomRef = useRef(null)

  useEffect(() => {
    if (!roomId) {
      navigate('/')
      return
    }

    const onMessage = (payload) => {
      setMessages((prev) => [...prev, payload])
    }

    const onSessionEnd = () => {
      navigate('/', { state: { ended: true } })
    }

    socket.on('message', onMessage)
    socket.on('session_end', onSessionEnd)

    return () => {
      socket.off('message', onMessage)
      socket.off('session_end', onSessionEnd)
    }
  }, [roomId, navigate])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = () => {
    if (!roomId) return
    const trimmed = text.trim()
    if (!trimmed) return
    socket.emit('message', { roomId, text: trimmed })
    setText('')
  }

  const endSession = () => {
    if (!roomId) return
    socket.emit('leave_room', { roomId })
  }

  if (!roomId) return null

  return (
    <main style={styles.container}>
      <header style={styles.header}>
        <div>You are both fighting {craving}.</div>
        <button style={styles.endButton} onClick={endSession}>
          End session
        </button>
      </header>

      <div style={styles.messages}>
        {messages.map((m, idx) => (
          <div key={idx} style={styles.message}>
            <strong>{m.from === socket.id ? 'You' : 'Partner'}:</strong> {m.text}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div style={styles.inputRow}>
        <input
          style={styles.input}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type a message..."
          maxLength={240}
        />
        <button style={styles.sendButton} onClick={sendMessage}>
          Send
        </button>
      </div>
    </main>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    padding: '1rem',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '1rem',
  },
  endButton: {
    padding: '0.5rem 0.8rem',
    background: '#ef4444',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
  },
  messages: {
    flex: 1,
    border: '1px solid #cbd5e1',
    borderRadius: 10,
    padding: '0.75rem',
    background: '#fff',
    overflowY: 'auto',
  },
  message: { marginBottom: '0.5rem' },
  inputRow: {
    display: 'flex',
    gap: '0.5rem',
  },
  input: {
    flex: 1,
    padding: '0.7rem',
    borderRadius: 8,
    border: '1px solid #cbd5e1',
  },
  sendButton: {
    padding: '0.7rem 1rem',
    borderRadius: 8,
    border: 'none',
    background: '#0ea5e9',
    color: '#fff',
    cursor: 'pointer',
  },
}

export default Chat

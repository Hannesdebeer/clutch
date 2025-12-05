const express = require('express')
const http = require('http')
const cors = require('cors')
const { Server } = require('socket.io')

const app = express()
app.use(cors())

const server = http.createServer(app)
const io = new Server(server, {
  cors: { origin: '*' },
})

const cravings = ['food', 'sugar', 'smoking', 'alcohol', 'spending', 'other']
const waitingUsers = cravings.reduce((acc, key) => ({ ...acc, [key]: [] }), {})
const sessionTimers = {}

io.on('connection', (socket) => {
  socket.on('join_craving', ({ craving }) => {
    if (!cravings.includes(craving)) return

    const queue = waitingUsers[craving]
    // Ensure this socket is not already enqueued (avoids self-pair from double joins)
    const existingIdx = queue.indexOf(socket.id)
    if (existingIdx !== -1) {
      queue.splice(existingIdx, 1)
    }

    if (queue.length > 0) {
      const partnerId = queue.shift()
      const partnerSocket = io.sockets.sockets.get(partnerId)
      if (!partnerSocket || partnerId === socket.id) {
        socket.emit('waiting')
        return
      }

      const roomId = `room_${socket.id}_${partnerId}`
      socket.join(roomId)
      partnerSocket.join(roomId)
      io.to(roomId).emit('matched', { roomId, craving })

      const timer = setTimeout(() => {
        io.to(roomId).emit('session_end')
        io.in(roomId).socketsLeave(roomId)
        delete sessionTimers[roomId]
      }, 3 * 60 * 1000)

      sessionTimers[roomId] = timer
    } else {
      queue.push(socket.id)
      socket.emit('waiting')
    }
  })

  socket.on('message', ({ roomId, text }) => {
    if (!roomId || typeof text !== 'string') return
    const trimmed = text.trim()
    if (!trimmed || trimmed.length > 240) return
    io.to(roomId).emit('message', { from: socket.id, text: trimmed })
  })

  socket.on('leave_room', ({ roomId }) => {
    if (!roomId) return
    // Notify everyone (including the caller) before clearing the room
    socket.emit('session_end')
    io.to(roomId).emit('session_end')
    if (sessionTimers[roomId]) {
      clearTimeout(sessionTimers[roomId])
      delete sessionTimers[roomId]
    }
    io.in(roomId).socketsLeave(roomId)
  })

  socket.on('disconnect', () => {
    cravings.forEach((c) => {
      const queue = waitingUsers[c]
      const idx = queue.indexOf(socket.id)
      if (idx !== -1) queue.splice(idx, 1)
    })
  })
})

const PORT = process.env.PORT || 4000
server.listen(PORT, () => {
  console.log(`Clutch server running on http://localhost:${PORT}`)
})

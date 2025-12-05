import { io } from 'socket.io-client'

const url = import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000'
const socket = io(url, {
  autoConnect: true,
})

export default socket

import { Routes, Route } from 'react-router-dom'
import Home from './Home'
import CravingSelect from './CravingSelect'
import Matching from './Matching'
import Chat from './Chat'
import './App.css'

function App() {
  return (
    <div className="app-shell">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/craving" element={<CravingSelect />} />
        <Route path="/matching" element={<Matching />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </div>
  )
}

export default App

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import NexusApp from './nexus/NexusApp'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/*" element={<NexusApp />} />
      </Routes>
    </Router>
  )
}

export default App
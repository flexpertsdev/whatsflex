import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import AppRoutes from './AppRoutes'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/*" element={<AppRoutes />} />
      </Routes>
    </Router>
  )
}

export default App
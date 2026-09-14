import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import HomePage from './pages/HomePage'
import DetailPage from './pages/DetailPage'
import TeamPage from './pages/TeamPage'
import ComparePage from './pages/ComparePage'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/pokemon/:name" element={<DetailPage />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/compare" element={<ComparePage />} />
      </Routes>
    </Layout>
  )
}

export default App
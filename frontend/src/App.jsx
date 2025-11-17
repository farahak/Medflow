import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import PatientsList from './pages/PatientsList'
import AppointmentsList from './pages/AppointmentsList'
import ConsultationPage from './pages/ConsultationPage'
import BillingPage from './pages/BillingPage'
import PatientPortal from './pages/PatientPortal'
import AdminSettings from './pages/AdminSettings'
import Signup from './pages/signup'
function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/patients" element={<PatientsList />} />
          <Route path="/appointments" element={<AppointmentsList />} />
          <Route path="/consultations" element={<ConsultationPage />} />
          <Route path="/billing" element={<BillingPage />} />
          <Route path="/settings" element={<AdminSettings />} />
          <Route path="/signup" element={<Signup/>} />
          <Route path="/patient-portal" element={<PatientPortal />} />
          
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App

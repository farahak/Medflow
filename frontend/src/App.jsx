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
import Appointment from './pages/addAppointments.jsx'
import AddAvailability from './pages/AddAvailability.jsx'
import MainPage from './pages/home.jsx'
import DashboardLayout from './components/DashboardLayout'

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/home" element={<MainPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Doctor Dashboard Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute allowedRoles={['medecin']}>
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            </ProtectedRoute>
          } />

          <Route path="/appointments" element={
            <ProtectedRoute allowedRoles={['medecin']}>
              <DashboardLayout>
                <AppointmentsList />
              </DashboardLayout>
            </ProtectedRoute>
          } />

          <Route path="/add-availability" element={
            <ProtectedRoute allowedRoles={['medecin']}>
              <DashboardLayout>
                <AddAvailability />
              </DashboardLayout>
            </ProtectedRoute>
          } />

          {/* Other Protected Routes (for future use) */}
          <Route path="/patients" element={
            <ProtectedRoute>
              <DashboardLayout>
                <PatientsList />
              </DashboardLayout>
            </ProtectedRoute>
          } />

          <Route path="/consultations" element={
            <ProtectedRoute>
              <DashboardLayout>
                <ConsultationPage />
              </DashboardLayout>
            </ProtectedRoute>
          } />

          <Route path="/billing" element={
            <ProtectedRoute>
              <DashboardLayout>
                <BillingPage />
              </DashboardLayout>
            </ProtectedRoute>
          } />

          <Route path="/settings" element={
            <ProtectedRoute>
              <DashboardLayout>
                <AdminSettings />
              </DashboardLayout>
            </ProtectedRoute>
          } />

          <Route path="/patient-portal" element={
            <ProtectedRoute>
              <DashboardLayout>
                <PatientPortal />
              </DashboardLayout>
            </ProtectedRoute>
          } />

          <Route path="/appointment" element={
            <ProtectedRoute>
              <DashboardLayout>
                <Appointment />
              </DashboardLayout>
            </ProtectedRoute>
          } />

          {/* Patient Appointment Booking Route */}
          <Route path="/addAppointments" element={
            <ProtectedRoute allowedRoles={['patient']}>
              <Appointment />
            </ProtectedRoute>
          } />

          {/* Default Redirect to Home */}
          <Route path="/" element={<Navigate to="/home" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App

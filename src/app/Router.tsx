/* eslint-disable react-refresh/only-export-components */
import { Suspense, lazy, type ReactNode } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout/AppLayout'
import LoginPage from '@/features/auth/pages/LoginPage'
import { PageSkeleton } from '@/components/shared/LoadingSkeleton/PageSkeleton'
import { useAuthStore } from '@/features/auth/store/authStore'

const DashboardPage = lazy(() => import('@/features/dashboard/pages/DashboardPage'))
const AgendaPage = lazy(() => import('@/features/agenda/pages/AgendaPage'))
const PatientsPage = lazy(() => import('@/features/patients/pages/PatientsPage'))
const PatientDetailPage = lazy(() => import('@/features/patients/pages/PatientDetailPage'))
const MedicalRecordsPage = lazy(() => import('@/features/medical-records/pages/MedicalRecordsPage'))
const FinancialPage = lazy(() => import('@/features/financial/pages/FinancialPage'))
const ProfessionalsPage = lazy(() => import('@/features/professionals/pages/ProfessionalsPage'))
const ReportsPage = lazy(() => import('@/features/reports/pages/ReportsPage'))
const SettingsPage = lazy(() => import('@/features/settings/pages/SettingsPage'))
const ForgotPasswordPage = lazy(() => import('@/features/auth/pages/ForgotPasswordPage'))
const ResetPasswordPage = lazy(() => import('@/features/auth/pages/ResetPasswordPage'))
const EmailVerificationPage = lazy(() => import('@/features/auth/pages/EmailVerificationPage'))

function SuspendedPage({ children }: { children: ReactNode }) {
  return <Suspense fallback={<PageSkeleton />}>{children}</Suspense>
}

function ProtectedRoute({ children }: { children: ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated())

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/forgot-password',
    element: <SuspendedPage><ForgotPasswordPage /></SuspendedPage>,
  },
  {
    path: '/reset-password',
    element: <SuspendedPage><ResetPasswordPage /></SuspendedPage>,
  },
  {
    path: '/verify-email',
    element: <SuspendedPage><EmailVerificationPage /></SuspendedPage>,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      {
        path: 'dashboard',
        element: <SuspendedPage><DashboardPage /></SuspendedPage>,
      },
      {
        path: 'agenda',
        element: <SuspendedPage><AgendaPage /></SuspendedPage>,
      },
      {
        path: 'patients',
        element: <SuspendedPage><PatientsPage /></SuspendedPage>,
      },
      {
        path: 'patients/:id',
        element: <SuspendedPage><PatientDetailPage /></SuspendedPage>,
      },
      {
        path: 'patients/:id/record',
        element: <SuspendedPage><MedicalRecordsPage /></SuspendedPage>,
      },
      {
        path: 'medical-records/:id',
        element: <SuspendedPage><MedicalRecordsPage /></SuspendedPage>,
      },
      {
        path: 'financial',
        element: <SuspendedPage><FinancialPage /></SuspendedPage>,
      },
      {
        path: 'professionals',
        element: <SuspendedPage><ProfessionalsPage /></SuspendedPage>,
      },
      {
        path: 'reports',
        element: <SuspendedPage><ReportsPage /></SuspendedPage>,
      },
      {
        path: 'settings',
        element: <SuspendedPage><SettingsPage /></SuspendedPage>,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])

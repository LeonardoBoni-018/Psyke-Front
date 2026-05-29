import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { PageLayout } from '../components/layout/PageLayout'
import { AgendaPage } from '../features/agenda/pages/AgendaPage'
import { DashboardPage } from '../features/dashboard/pages/DashboardPage'
import { FinancialPage } from '../features/financial/pages/FinancialPage'
import { LoginPage } from '../features/auth/pages/LoginPage'
import { MedicalRecordsPage } from '../features/medical-records/pages/MedicalRecordsPage'
import { PatientsPage } from '../features/patients/pages/PatientsPage'
import { ProfessionalsPage } from '../features/professionals/pages/ProfessionalsPage'
import { ReportsPage } from '../features/reports/pages/ReportsPage'
import { SettingsPage } from '../features/settings/pages/SettingsPage'

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <PageLayout>
              <DashboardPage />
            </PageLayout>
          }
        />
        <Route
          path="/agenda"
          element={
            <PageLayout>
              <AgendaPage />
            </PageLayout>
          }
        />
        <Route
          path="/patients"
          element={
            <PageLayout>
              <PatientsPage />
            </PageLayout>
          }
        />
        <Route
          path="/medical-records"
          element={
            <PageLayout>
              <MedicalRecordsPage />
            </PageLayout>
          }
        />
        <Route
          path="/financial"
          element={
            <PageLayout>
              <FinancialPage />
            </PageLayout>
          }
        />
        <Route
          path="/professionals"
          element={
            <PageLayout>
              <ProfessionalsPage />
            </PageLayout>
          }
        />
        <Route
          path="/reports"
          element={
            <PageLayout>
              <ReportsPage />
            </PageLayout>
          }
        />
        <Route
          path="/settings"
          element={
            <PageLayout>
              <SettingsPage />
            </PageLayout>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

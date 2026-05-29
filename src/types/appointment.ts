export interface Appointment {
  id: string
  patientId: string
  professionalId: string
  startAt: string
  endAt: string
  status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed'
}

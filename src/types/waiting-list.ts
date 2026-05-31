export type WaitingListStatus = 'WAITING' | 'OFFERED' | 'ACCEPTED' | 'REMOVED'

export interface WaitingListEntry {
  id: string
  patientId: string
  professionalId: string
  preferredDayOfWeek?: number
  preferredPeriod?: 'MORNING' | 'AFTERNOON' | 'EVENING'
  notes?: string
  status: WaitingListStatus
  createdAt: string
}

export interface WaitingListRequest {
  patientId: string
  professionalId: string
  preferredDayOfWeek?: number
  preferredPeriod?: 'MORNING' | 'AFTERNOON' | 'EVENING'
  notes?: string
}

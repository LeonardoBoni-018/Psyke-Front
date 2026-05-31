export interface EvolutionSuggestionRequest {
  patientId: string
  sessionNotes: string
  techniques?: string[]
}

export interface EvolutionSuggestionResponse {
  subjective: string
  objective: string
  assessment: string
  plan: string
}

export interface SlotSuggestionRequest {
  professionalId: string
  duration: number
  preferredPeriod?: 'MORNING' | 'AFTERNOON' | 'EVENING'
  startDate: string
  endDate: string
}

export interface SlotSuggestionResponse {
  suggestedSlots: Array<{
    startTime: string
    endTime: string
    score: number
    reason: string
  }>
}

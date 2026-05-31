import { api } from '@/lib/axios'
import type {
  EvolutionSuggestionRequest,
  EvolutionSuggestionResponse,
  SlotSuggestionRequest,
  SlotSuggestionResponse,
} from '@/types/ai'

export async function suggestEvolution(data: EvolutionSuggestionRequest): Promise<EvolutionSuggestionResponse> {
  const response = await api.post<EvolutionSuggestionResponse>('/ai/evolution/suggest', data)
  return response.data
}

export async function suggestSlots(data: SlotSuggestionRequest): Promise<SlotSuggestionResponse> {
  const response = await api.post<SlotSuggestionResponse>('/ai/slots/suggest', data)
  return response.data
}

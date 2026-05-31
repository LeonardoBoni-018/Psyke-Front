import { api } from '@/lib/axios'
import type { WaitingListEntry, WaitingListRequest } from '@/types/waiting-list'

export async function joinWaitingList(data: WaitingListRequest): Promise<WaitingListEntry> {
  const response = await api.post<WaitingListEntry>('/waiting-list', data)
  return response.data
}

export async function listWaitingList(professionalId: string): Promise<WaitingListEntry[]> {
  const response = await api.get<WaitingListEntry[]>('/waiting-list', { params: { professionalId } })
  return response.data
}

export async function removeFromWaitingList(id: string): Promise<void> {
  await api.delete(`/waiting-list/${id}`)
}

export async function acceptOffer(id: string): Promise<void> {
  await api.post(`/waiting-list/${id}/accept`)
}

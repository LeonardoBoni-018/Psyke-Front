import { api } from '@/lib/axios'
import type { RoomResponse, CreateRoomRequest, UpdateRoomRequest } from '@/types/room'

export async function listActiveRooms(): Promise<RoomResponse[]> {
  const response = await api.get<RoomResponse[]>('/rooms')
  return response.data
}

export async function findRoomById(id: string): Promise<RoomResponse> {
  const response = await api.get<RoomResponse>(`/rooms/${id}`)
  return response.data
}

export async function createRoom(data: CreateRoomRequest): Promise<RoomResponse> {
  const response = await api.post<RoomResponse>('/rooms', data)
  return response.data
}

export async function updateRoom(id: string, data: UpdateRoomRequest): Promise<RoomResponse> {
  const response = await api.put<RoomResponse>(`/rooms/${id}`, data)
  return response.data
}

export async function deleteRoom(id: string): Promise<void> {
  await api.delete(`/rooms/${id}`)
}

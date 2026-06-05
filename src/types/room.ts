export type RoomType = 'PHYSICAL' | 'VIRTUAL'

export interface RoomResponse {
  id: string
  name: string
  type: RoomType
  capacity: number
  color: string
  active: boolean
  createdAt: string
}

export interface CreateRoomRequest {
  name: string
  type: RoomType
  capacity?: number
  color?: string
}

export type UpdateRoomRequest = Partial<CreateRoomRequest>
export type RoomType = 'PHYSICAL' | 'VIRTUAL'
export type RoomStatus = 'ACTIVE' | 'INACTIVE'

export interface RoomResponse {
  id: string
  name: string
  type: RoomType
  capacity: number
  color: string
  status: RoomStatus
}

export interface CreateRoomRequest {
  name: string
  type: RoomType
  capacity?: number
  color?: string
}

export type UpdateRoomRequest = Partial<CreateRoomRequest>

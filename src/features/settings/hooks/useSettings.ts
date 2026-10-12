import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { getCurrentClinic, updateClinic, type UpdateClinicRequest } from '@/features/settings/services/clinicApi'
import { createRoom, deleteRoom, listActiveRooms } from '@/features/settings/services/roomApi'
import { getCurrentTenant } from '@/features/settings/services/tenantApi'
import { listUsers } from '@/features/settings/services/userApi'
import { getApiErrorMessage } from '@/lib/errors'
import type { CreateRoomRequest } from '@/types/room'

const CLINIC_KEY = ['settings', 'clinic'] as const
const TENANT_KEY = ['settings', 'tenant'] as const
const ROOMS_KEY = ['rooms'] as const
const USERS_KEY = ['settings', 'users'] as const

export function useClinic() {
  return useQuery({ queryKey: CLINIC_KEY, queryFn: getCurrentClinic, staleTime: 1000 * 60 * 5 })
}

export function useTenant() {
  return useQuery({ queryKey: TENANT_KEY, queryFn: getCurrentTenant, staleTime: 1000 * 60 * 10 })
}

export function useUpdateClinic() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateClinicRequest }) => updateClinic(id, data),
    onSuccess: (clinic) => {
      queryClient.setQueryData(CLINIC_KEY, clinic)
      toast.success('Dados da clínica salvos')
    },
    onError: (error) => toast.error('Não foi possível salvar', { description: getApiErrorMessage(error) }),
  })
}

export function useRooms() {
  return useQuery({ queryKey: ROOMS_KEY, queryFn: listActiveRooms, staleTime: 1000 * 60 * 2 })
}

export function useCreateRoom() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateRoomRequest) => createRoom(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ROOMS_KEY })
      toast.success('Sala criada')
    },
    onError: (error) => toast.error('Não foi possível criar a sala', { description: getApiErrorMessage(error) }),
  })
}

export function useDeleteRoom() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteRoom(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ROOMS_KEY })
      toast.success('Sala removida')
    },
    onError: (error) => toast.error('Não foi possível remover a sala', { description: getApiErrorMessage(error) }),
  })
}

export function useUsers() {
  return useQuery({ queryKey: USERS_KEY, queryFn: () => listUsers({ size: 100 }), staleTime: 1000 * 60 * 2 })
}

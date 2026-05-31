import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getSlots, listAvailability, createAvailability, listExceptions, createException } from '@/features/professionals/services/availabilityApi'
import type { CreateAvailabilityRequest, CreateExceptionRequest } from '@/types/professional'

export const AVAILABILITY_KEY = ['availability'] as const

export function useSlots(params: { professionalId: string; startDate: string; endDate: string }) {
  return useQuery({
    queryKey: [...AVAILABILITY_KEY, 'slots', params],
    queryFn: () => getSlots(params),
    enabled: !!params.professionalId,
  })
}

export function useAvailability(professionalId: string) {
  return useQuery({
    queryKey: [...AVAILABILITY_KEY, professionalId],
    queryFn: () => listAvailability(professionalId),
    enabled: !!professionalId,
  })
}

export function useCreateAvailability() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateAvailabilityRequest) => createAvailability(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: AVAILABILITY_KEY }),
  })
}

export function useExceptions(professionalId: string) {
  return useQuery({
    queryKey: [...AVAILABILITY_KEY, 'exceptions', professionalId],
    queryFn: () => listExceptions(professionalId),
    enabled: !!professionalId,
  })
}

export function useCreateException() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateExceptionRequest) => createException(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: AVAILABILITY_KEY }),
  })
}

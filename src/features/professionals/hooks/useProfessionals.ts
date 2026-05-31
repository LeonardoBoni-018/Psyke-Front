import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { listProfessionals, findProfessionalById, createProfessional, updateProfessional, deleteProfessional } from '@/features/professionals/services/professionalApi'
import type { CreateProfessionalRequest, UpdateProfessionalRequest } from '@/types/professional'

export const PROFESSIONALS_KEY = ['professionals'] as const

export function useProfessionals(params?: { page?: number; size?: number }) {
  return useQuery({
    queryKey: [...PROFESSIONALS_KEY, params],
    queryFn: () => listProfessionals(params),
    staleTime: 1000 * 60 * 5,
  })
}

export function useProfessional(id: string) {
  return useQuery({
    queryKey: [...PROFESSIONALS_KEY, id],
    queryFn: () => findProfessionalById(id),
    enabled: !!id,
  })
}

export function useCreateProfessional() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateProfessionalRequest) => createProfessional(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PROFESSIONALS_KEY }),
  })
}

export function useUpdateProfessional() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProfessionalRequest }) => updateProfessional(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PROFESSIONALS_KEY }),
  })
}

export function useDeleteProfessional() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteProfessional(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PROFESSIONALS_KEY }),
  })
}

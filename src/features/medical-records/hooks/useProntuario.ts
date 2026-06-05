import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  findProntuarioByPatient,
  findProntuarioById,
  createProntuario,
  updateProntuario,
  archiveProntuario,
  addEvolucao,
  listEvolucoes,
  createAnamnese,
  findAnamnese,
  updateAnamnese,
} from '@/features/medical-records/services/medicalRecordApi'
import type { CreateProntuarioRequest, UpdateProntuarioRequest, CreateEvolucaoRequest, CreateAnamneseRequest, UpdateAnamneseRequest } from '@/types/medical-record'

export const PRONTUARIO_KEY = ['prontuario'] as const

export function useProntuarioByPatient(patientId: string) {
  return useQuery({
    queryKey: [...PRONTUARIO_KEY, 'patient', patientId],
    queryFn: () => findProntuarioByPatient(patientId),
    enabled: !!patientId,
  })
}

export function useProntuario(id: string) {
  return useQuery({
    queryKey: [...PRONTUARIO_KEY, id],
    queryFn: () => findProntuarioById(id),
    enabled: !!id,
  })
}

export function useCreateProntuario() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateProntuarioRequest) => createProntuario(data),
    onSuccess: (result, variables) => {
      queryClient.setQueryData<ProntuarioResponse>(
        [...PRONTUARIO_KEY, 'patient', variables.patientId],
        result,
      )
      queryClient.invalidateQueries({ queryKey: PRONTUARIO_KEY })
    },
  })
}

export function useUpdateProntuario() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProntuarioRequest }) => updateProntuario(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PRONTUARIO_KEY }),
  })
}

export function useArchiveProntuario() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => archiveProntuario(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PRONTUARIO_KEY }),
  })
}

export function useEvolucoes(prontuarioId: string) {
  return useQuery({
    queryKey: [...PRONTUARIO_KEY, 'evolucoes', prontuarioId],
    queryFn: () => listEvolucoes(prontuarioId),
    enabled: !!prontuarioId,
  })
}

export function useAddEvolucao() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateEvolucaoRequest) => addEvolucao(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PRONTUARIO_KEY }),
  })
}

export function useAnamnese(prontuarioId: string) {
  return useQuery({
    queryKey: [...PRONTUARIO_KEY, 'anamnese', prontuarioId],
    queryFn: () => findAnamnese(prontuarioId),
    enabled: !!prontuarioId,
  })
}

export function useCreateAnamnese() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateAnamneseRequest) => createAnamnese(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PRONTUARIO_KEY }),
  })
}

export function useUpdateAnamnese() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ prontuarioId, data }: { prontuarioId: string; data: UpdateAnamneseRequest }) => updateAnamnese(prontuarioId, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: PRONTUARIO_KEY }),
  })
}

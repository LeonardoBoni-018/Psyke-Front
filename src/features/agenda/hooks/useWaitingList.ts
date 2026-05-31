import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { joinWaitingList, listWaitingList, removeFromWaitingList, acceptOffer } from '@/features/agenda/services/waitingListApi'
import type { WaitingListRequest } from '@/types/waiting-list'

export const WAITING_LIST_KEY = ['waiting-list'] as const

export function useWaitingList(professionalId: string) {
  return useQuery({
    queryKey: [...WAITING_LIST_KEY, professionalId],
    queryFn: () => listWaitingList(professionalId),
    enabled: !!professionalId,
  })
}

export function useJoinWaitingList() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: WaitingListRequest) => joinWaitingList(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: WAITING_LIST_KEY }),
  })
}

export function useAcceptOffer() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => acceptOffer(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: WAITING_LIST_KEY }),
  })
}

export function useRemoveFromWaitingList() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => removeFromWaitingList(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: WAITING_LIST_KEY }),
  })
}

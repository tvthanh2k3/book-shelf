import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { PaginatedResponse } from '@/types'

interface CRUDService<T, TCreate, TUpdate> {
  list: (skip: number, limit: number) => Promise<PaginatedResponse<T>>
  create: (payload: TCreate) => Promise<T>
  update: (id: number, payload: TUpdate) => Promise<T>
  remove: (id: number) => Promise<void>
}

export function createCRUDHooks<T, TCreate, TUpdate>(
  queryKey: string,
  service: CRUDService<T, TCreate, TUpdate>,
  entityName: string,
) {
  const useList = (page: number, pageSize: number) => {
    const skip = (page - 1) * pageSize
    return useQuery({
      queryKey: [queryKey, page, pageSize],
      queryFn: () => service.list(skip, pageSize),
    })
  }

  const useCreate = () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: (payload: TCreate) => service.create(payload),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [queryKey] })
        toast.success(`${entityName} created successfully`)
      },
      onError: (err: Error) => toast.error(err.message),
    })
  }

  const useUpdate = () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: ({ id, payload }: { id: number; payload: TUpdate }) =>
        service.update(id, payload),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [queryKey] })
        toast.success(`${entityName} updated successfully`)
      },
      onError: (err: Error) => toast.error(err.message),
    })
  }

  const useRemove = () => {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: (id: number) => service.remove(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [queryKey] })
        toast.success(`${entityName} deleted successfully`)
      },
      onError: (err: Error) => toast.error(err.message),
    })
  }

  return { useList, useCreate, useUpdate, useRemove }
}

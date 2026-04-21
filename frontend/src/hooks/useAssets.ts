import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAssets, createAsset, updateAsset, deleteAsset } from "@base/services/assetsService";
import type { NewAsset } from "@base/types/assets";
import toast from "react-hot-toast";

export const ASSETS_QUERY_KEY = ['assets'] as const


export function useAssets() {
    const queryClient = useQueryClient()

    const query = useQuery({
        queryKey: ASSETS_QUERY_KEY,
        queryFn: getAssets,
    })

    const addAsset = useMutation({
        mutationFn: (data: NewAsset) => createAsset(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ASSETS_QUERY_KEY})
        },
        onError: (err: any) => {
            const msg = err.response?.data?.codigo?.[0] || 'Falha ao Registrar ativo'
            toast.error(msg)
        },
    })

    const editAsset = useMutation({
        mutationFn: ({ id, data }: { id: number; data: NewAsset }) => 
            updateAsset(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ASSETS_QUERY_KEY })
        },
        onError: () => {
            toast.error('Não foi possivel salvar as alterações.')
        }
    })

    const removeAsset = useMutation({
        mutationFn: (id: number) => deleteAsset(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ASSETS_QUERY_KEY })
        },
        onError: () => {
            toast.error('Não foi possivel remover o ativo.')
        }
    })

    return {
        assets: query.data ?? [],
        isLoading: query.isLoading,
        isError: query.isError,
        error: query.error,
        addAsset,
        editAsset,
        removeAsset,
    }
}




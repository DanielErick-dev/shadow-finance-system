import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
} from '@base/services/categoriesService'
import type { NewCategoryData } from '@base/types/expenses'
import toast from 'react-hot-toast'

export const CATEGORIES_QUERY_KEY = 'categories' as const

export function useCategories() {
    const queryClient = useQueryClient()

    const query = useQuery({
        queryKey: [CATEGORIES_QUERY_KEY],
        queryFn: getCategories,
    })

    const invalidate = () =>
        queryClient.invalidateQueries({ queryKey: [CATEGORIES_QUERY_KEY] })

    const addCategory = useMutation({
        mutationFn: (data: NewCategoryData) => createCategory(data),
        onSuccess: () => { invalidate(); toast.success('Categoria criada com sucesso!') },
        onError: (err: any) => {
            const msg = err.response?.data?.name?.[0] || 'Falha ao criar categoria.'
            toast.error(msg)
        },
    })

    const editCategory = useMutation({
        mutationFn: ({ id, data }: { id: number; data: NewCategoryData }) => updateCategory(id, data),
        onSuccess: () => { invalidate(); toast.success('Categoria atualizada com sucesso!') },
        onError: () => toast.error('Não foi possível atualizar a categoria.'),
    })

    const removeCategory = useMutation({
        mutationFn: (id: number) => deleteCategory(id),
        onSuccess: () => { invalidate(); toast.success('Categoria excluída com sucesso!') },
        onError: () => toast.error('Não foi possível excluir a categoria.'),
    })

    return {
        categories: query.data ?? [],
        isLoading: query.isLoading,
        isError: query.isError,
        addCategory,
        editCategory,
        removeCategory,
    }
}

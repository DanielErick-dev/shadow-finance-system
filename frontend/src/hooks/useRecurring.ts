import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
    getRecurringExpenses,
    createRecurringExpense,
    updateRecurringExpense,
    deleteRecurringExpense,
} from '@base/services/recurringService'
import type { NewRecurringExpense } from '@base/types/expenses'
import toast from 'react-hot-toast'
import { extractApiError } from '@base/lib/api'

export const RECURRING_QUERY_KEY = 'recurring' as const

export function useRecurring() {
    const queryClient = useQueryClient()

    const query = useQuery({
        queryKey: [RECURRING_QUERY_KEY],
        queryFn: getRecurringExpenses,
    })

    const invalidate = () =>
        queryClient.invalidateQueries({ queryKey: [RECURRING_QUERY_KEY] })

    const addRecurring = useMutation({
        mutationFn: (data: NewRecurringExpense) => createRecurringExpense(data),
        onSuccess: () => { invalidate(); toast.success('Despesa recorrente criada com sucesso!') },
        onError: (err) => toast.error(extractApiError(err, 'Não foi possível salvar a despesa recorrente.')),
    })

    const editRecurring = useMutation({
        mutationFn: ({ id, data }: { id: number; data: NewRecurringExpense }) =>
            updateRecurringExpense(id, data),
        onSuccess: () => { invalidate(); toast.success('Despesa recorrente atualizada com sucesso!') },
        onError: (err) => toast.error(extractApiError(err, 'Não foi possível editar a despesa recorrente.')),
    })

    const removeRecurring = useMutation({
        mutationFn: (id: number) => deleteRecurringExpense(id),
        onSuccess: () => { invalidate(); toast.success('Despesa recorrente excluída com sucesso!') },
        onError: (err) => toast.error(extractApiError(err, 'Não foi possível excluir a despesa recorrente.')),
    })

    return {
        recurringExpenses: query.data ?? [],
        isLoading: query.isLoading,
        isError: query.isError,
        addRecurring,
        editRecurring,
        removeRecurring,
    }
}

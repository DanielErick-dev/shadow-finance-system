import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
    getInstallments,
    createInstallment,
    deleteInstallment,
} from '@base/services/installmentsService'
import type { NewInstallmentExpenseData } from '@base/types/expenses'
import toast from 'react-hot-toast'
import { extractApiError } from '@base/lib/api'

export const INSTALLMENTS_QUERY_KEY = 'installments' as const

export function useInstallments() {
    const queryClient = useQueryClient()

    const query = useQuery({
        queryKey: [INSTALLMENTS_QUERY_KEY],
        queryFn: getInstallments,
    })

    const invalidate = () =>
        queryClient.invalidateQueries({ queryKey: [INSTALLMENTS_QUERY_KEY] })

    const addInstallment = useMutation({
        mutationFn: (data: NewInstallmentExpenseData) => createInstallment(data),
        onSuccess: () => { invalidate(); toast.success('Despesa parcelada criada com sucesso!') },
        onError: (err) => toast.error(extractApiError(err, 'Não foi possível adicionar a despesa parcelada.')),
    })

    const removeInstallment = useMutation({
        mutationFn: (id: number) => deleteInstallment(id),
        onSuccess: () => { invalidate(); toast.success('Despesa parcelada excluída com sucesso!') },
        onError: (err) => toast.error(extractApiError(err, 'Não foi possível excluir a despesa parcelada.')),
    })

    return {
        installments: query.data ?? [],
        isLoading: query.isLoading,
        isError: query.isError,
        addInstallment,
        removeInstallment,
    }
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
    getInvestments,
    createInvestmentItem,
    updateInvestmentItem,
    deleteInvestmentItem,
    createInvestmentMonthCard,
    deleteInvestmentMonthCard,
    type InvestmentFilters,
} from '@base/services/investmentsService'
import type { NewItemInvestiment, EditItemInvestiment, NewCardInvestiment } from '@base/types/investiments'
import toast from 'react-hot-toast'

export const INVESTMENTS_QUERY_KEY = 'investments' as const

export function useInvestments(filters: InvestmentFilters = {}, page: number = 1) {
    const queryClient = useQueryClient()

    const queryKey = [INVESTMENTS_QUERY_KEY, filters, page]

    const query = useQuery({
        queryKey,
        queryFn: () => getInvestments(filters, page),
    })

    const invalidate = () =>
        queryClient.invalidateQueries({ queryKey: [INVESTMENTS_QUERY_KEY] })

    const addInvestmentItem = useMutation({
        mutationFn: (data: NewItemInvestiment) => createInvestmentItem(data),
        onSuccess: () => { invalidate(); toast.success('Investimento adicionado com sucesso!') },
        onError: () => toast.error('Falha ao adicionar investimento.'),
    })

    const editInvestmentItem = useMutation({
        mutationFn: ({ itemId, data }: { itemId: number; data: EditItemInvestiment }) =>
            updateInvestmentItem(itemId, data),
        onSuccess: () => { invalidate(); toast.success('Investimento atualizado com sucesso!') },
        onError: () => toast.error('Falha ao atualizar registro.'),
    })

    const removeInvestmentItem = useMutation({
        mutationFn: (itemId: number) => deleteInvestmentItem(itemId),
        onSuccess: () => { invalidate(); toast.success('Investimento excluído com sucesso.') },
        onError: () => toast.error('Falha ao excluir investimento.'),
    })

    const addMonthCard = useMutation({
        mutationFn: (data: NewCardInvestiment) => createInvestmentMonthCard(data),
        onSuccess: () => { invalidate(); toast.success('Novo mês de referência criado!') },
        onError: (err: any) => {
            const msg = err.response?.data?.detail || 'Não foi possível criar o registro.'
            toast.error(msg)
        },
    })

    const removeMonthCard = useMutation({
        mutationFn: (cardId: number) => deleteInvestmentMonthCard(cardId),
        onSuccess: () => { invalidate(); toast.success('Mês excluído com sucesso.') },
        onError: () => toast.error('Falha ao excluir o mês.'),
    })

    return {
        cards: query.data?.results ?? [],
        count: query.data?.count ?? 0,
        isLoading: query.isLoading,
        isError: query.isError,
        addInvestmentItem,
        editInvestmentItem,
        removeInvestmentItem,
        addMonthCard,
        removeMonthCard,
    }
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
    getDividends,
    createDividendItem,
    updateDividendItem,
    deleteDividendItem,
    createMonthCard,
    deleteMonthCard,
    type DividendFilters,
} from '@base/services/dividendsService'
import type { NewItemDividend, EditItemDividend, NewDividendMonth } from '@base/types/dividends'
import toast from 'react-hot-toast'
import { extractApiError } from '@base/lib/api'

export const DIVIDENDS_QUERY_KEY = 'dividends' as const

export function useDividends(filters: DividendFilters = {}, page: number = 1) {
    const queryClient = useQueryClient()

    const queryKey = [DIVIDENDS_QUERY_KEY, filters, page]

    const query = useQuery({
        queryKey,
        queryFn: () => getDividends(filters, page),
    })

    const invalidate = () =>
        queryClient.invalidateQueries({ queryKey: [DIVIDENDS_QUERY_KEY] })

    const addDividendItem = useMutation({
        mutationFn: (data: NewItemDividend) => createDividendItem(data),
        onSuccess: () => { invalidate(); toast.success('Dividendo adicionado com sucesso!') },
        onError: (err) => toast.error(extractApiError(err, 'Falha ao adicionar dividendo.')),
    })

    const editDividendItem = useMutation({
        mutationFn: ({ itemId, data }: { itemId: number; data: EditItemDividend }) =>
            updateDividendItem(itemId, data),
        onSuccess: () => { invalidate(); toast.success('Dividendo atualizado com sucesso!') },
        onError: (err) => toast.error(extractApiError(err, 'Falha ao atualizar registro.')),
    })

    const removeDividendItem = useMutation({
        mutationFn: (itemId: number) => deleteDividendItem(itemId),
        onSuccess: () => { invalidate(); toast.success('Dividendo excluído com sucesso.') },
        onError: (err) => toast.error(extractApiError(err, 'Falha ao excluir dividendo.')),
    })

    const addMonthCard = useMutation({
        mutationFn: (data: NewDividendMonth) => createMonthCard(data),
        onSuccess: () => { invalidate(); toast.success('Novo mês de referência criado!') },
        onError: (err) => toast.error(extractApiError(err, 'Não foi possível criar o registro.')),
    })

    const removeMonthCard = useMutation({
        mutationFn: (cardId: number) => deleteMonthCard(cardId),
        onSuccess: () => { invalidate(); toast.success('Mês excluído com sucesso.') },
        onError: (err) => toast.error(extractApiError(err, 'Falha ao excluir o mês.')),
    })

    return {
        cards: query.data?.results ?? [],
        count: query.data?.count ?? 0,
        isLoading: query.isLoading,
        isError: query.isError,
        addDividendItem,
        editDividendItem,
        removeDividendItem,
        addMonthCard,
        removeMonthCard,
    }
}

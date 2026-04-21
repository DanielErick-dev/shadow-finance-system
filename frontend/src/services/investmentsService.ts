import api from '@base/lib/api'
import type { CardInvestimentMonth, NewCardInvestiment, NewItemInvestiment, EditItemInvestiment } from '@base/types/investiments'
import type { PaginatedResponse } from '@base/types/api'

export type InvestmentFilters = {
    year?: number | string;
    month?: number | string;
}

export const getInvestments = async (
    filters: InvestmentFilters = {},
    page: number = 1
): Promise<PaginatedResponse<CardInvestimentMonth>> => {
    const response = await api.get<PaginatedResponse<CardInvestimentMonth>>('/cards-investiments/', {
        params: { ...filters, page }
    })
    return response.data
}

export const createInvestmentItem = async (data: NewItemInvestiment): Promise<void> => {
    await api.post('/itens-investiments/', data)
}

export const updateInvestmentItem = async (itemId: number, data: EditItemInvestiment): Promise<void> => {
    await api.patch(`/itens-investiments/${itemId}/`, data)
}

export const deleteInvestmentItem = async (itemId: number): Promise<void> => {
    await api.delete(`/itens-investiments/${itemId}/`)
}

export const createInvestmentMonthCard = async (data: NewCardInvestiment): Promise<void> => {
    await api.post('/cards-investiments/', data)
}

export const deleteInvestmentMonthCard = async (cardId: number): Promise<void> => {
    await api.delete(`/cards-investiments/${cardId}/`)
}

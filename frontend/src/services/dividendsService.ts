import api from '@base/lib/api'
import type { DividendMonth, NewDividendMonth, NewItemDividend, EditItemDividend } from '@base/types/dividends'
import type { PaginatedResponse } from '@base/types/api'

export type DividendFilters = {
    year?: number | string;
    month?: number | string;
}

export const getDividends = async (
    filters: DividendFilters = {},
    page: number = 1
): Promise<PaginatedResponse<DividendMonth>> => {
    const response = await api.get<PaginatedResponse<DividendMonth>>('/cards-dividends/', {
        params: { ...filters, page }
    })
    return response.data
}

export const createDividendItem = async (data: NewItemDividend): Promise<void> => {
    await api.post('/itens-dividends/', data)
}

export const updateDividendItem = async (itemId: number, data: EditItemDividend): Promise<void> => {
    await api.patch(`/itens-dividends/${itemId}/`, data)
}

export const deleteDividendItem = async (itemId: number): Promise<void> => {
    await api.delete(`/itens-dividends/${itemId}/`)
}

export const createMonthCard = async (data: NewDividendMonth): Promise<void> => {
    await api.post('/cards-dividends/', data)
}

export const deleteMonthCard = async (cardId: number): Promise<void> => {
    await api.delete(`/cards-dividends/${cardId}/`)
}

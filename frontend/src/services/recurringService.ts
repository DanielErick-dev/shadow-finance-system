import api from '@base/lib/api'
import type { RecurringExpense, NewRecurringExpense } from '@base/types/expenses'

export const getRecurringExpenses = async (): Promise<RecurringExpense[]> => {
    const response = await api.get<RecurringExpense[]>('/recurring/')
    return response.data
}

export const createRecurringExpense = async (data: NewRecurringExpense): Promise<RecurringExpense> => {
    const response = await api.post<RecurringExpense>('/recurring/', data)
    return response.data
}

export const updateRecurringExpense = async (
    id: number,
    data: NewRecurringExpense
): Promise<RecurringExpense> => {
    const response = await api.put<RecurringExpense>(`/recurring/${id}/`, data)
    return response.data
}

export const deleteRecurringExpense = async (id: number): Promise<void> => {
    await api.delete(`/recurring/${id}/`)
}

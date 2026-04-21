import api from '@base/lib/api'
import type { MonthlyExpense, ExpenseFormData, PaidRecurringExpenseData } from '@base/types/expenses'

export type ExpenseFilters = {
    due_date__year?: number | string;
    due_date__month?: number | string;
    search?: string;
}

export const getExpenses = async (filters: ExpenseFilters = {}): Promise<MonthlyExpense[]> => {
    const response = await api.get<MonthlyExpense[]>('/monthly-view/', { params: filters })
    return response.data
}

export const createExpense = async (data: ExpenseFormData): Promise<MonthlyExpense> => {
    const response = await api.post<MonthlyExpense>('/expenses/', data)
    return response.data
}

export const updateExpense = async (id: number, data: ExpenseFormData): Promise<MonthlyExpense> => {
    const response = await api.put<MonthlyExpense>(`/expenses/${id}/`, data)
    return response.data
}

export const deleteExpense = async (id: number): Promise<void> => {
    await api.delete(`/expenses/${id}/`)
}

export const markExpenseAsPaid = async (id: number): Promise<void> => {
    await api.patch(`/expenses/${id}/`, { paid: true })
}

export const createPaidRecurringInstance = async (data: PaidRecurringExpenseData): Promise<void> => {
    await api.post('/paid-recurring/', data)
}

import api from '@base/lib/api'
import type { InstallmentExpense, NewInstallmentExpenseData } from '@base/types/expenses'

export const getInstallments = async (): Promise<InstallmentExpense[]> => {
    const response = await api.get<InstallmentExpense[]>('/installments/')
    return response.data
}

export const createInstallment = async (data: NewInstallmentExpenseData): Promise<InstallmentExpense> => {
    const response = await api.post<InstallmentExpense>('/installments/', data)
    return response.data
}

export const deleteInstallment = async (id: number): Promise<void> => {
    await api.delete(`/installments/${id}/`)
}

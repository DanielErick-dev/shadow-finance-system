import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
    getExpenses,
    createExpense,
    updateExpense,
    deleteExpense,
    markExpenseAsPaid,
    createPaidRecurringInstance,
    type ExpenseFilters,
} from '@base/services/expensesService'
import type { ExpenseFormData, MonthlyExpense } from '@base/types/expenses'
import toast from 'react-hot-toast'

export const EXPENSES_QUERY_KEY = 'expenses' as const

export function useExpenses(filters: ExpenseFilters = {}) {
    const queryClient = useQueryClient()

    const queryKey = [EXPENSES_QUERY_KEY, filters]

    const query = useQuery({
        queryKey,
        queryFn: () => getExpenses(filters),
    })

    const invalidate = () =>
        queryClient.invalidateQueries({ queryKey: [EXPENSES_QUERY_KEY] })

    const addExpense = useMutation({
        mutationFn: (data: ExpenseFormData) => createExpense(data),
        onSuccess: () => { invalidate(); toast.success('Despesa registrada com sucesso!') },
        onError: () => toast.error('Não foi possível registrar a despesa.'),
    })

    const editExpense = useMutation({
        mutationFn: ({ id, data }: { id: number; data: ExpenseFormData }) => updateExpense(id, data),
        onSuccess: () => { invalidate(); toast.success('Despesa atualizada com sucesso!') },
        onError: () => toast.error('Não foi possível atualizar a despesa.'),
    })

    const removeExpense = useMutation({
        mutationFn: (id: number) => deleteExpense(id),
        onSuccess: () => { invalidate(); toast.success('Despesa excluída com sucesso!') },
        onError: () => toast.error('Não foi possível excluir a despesa.'),
    })

    const payExpense = useMutation({
        mutationFn: (id: number) => markExpenseAsPaid(id),
        onSuccess: () => { invalidate(); toast.success('Despesa marcada como paga!') },
        onError: () => toast.error('Não foi possível marcar a despesa como paga.'),
    })

    // Registra pagamento de despesa recorrente — usa a expense como base para extrair data/mês/ano
    const payRecurringExpense = useMutation({
        mutationFn: (expense: MonthlyExpense) => {
            const dueDate = new Date(expense.due_date + 'T00:00:00')
            return createPaidRecurringInstance({
                recurring_expense_id: expense.id,
                payment_date: new Date().toISOString().split('T')[0],
                month: dueDate.getMonth() + 1,
                year: dueDate.getFullYear(),
            })
        },
        onSuccess: () => { invalidate(); toast.success('Pagamento registrado com sucesso!') },
        onError: () => toast.error('Não foi possível registrar o pagamento.'),
    })

    return {
        expenses: query.data ?? [],
        isLoading: query.isLoading,
        isError: query.isError,
        addExpense,
        editExpense,
        removeExpense,
        payExpense,
        payRecurringExpense,
    }
}

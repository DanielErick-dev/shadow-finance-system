import api from "@base/lib/api";
import toast from "react-hot-toast";
import type { ExpenseFormData, MonthlyExpense } from "@base/types/expenses";
import { create } from "zustand";

type ExpenseFilters = {
    due_date__year?: number
    due_date__month?: number
    search?: string;
}

export type ExpensesState = {
    expenses: MonthlyExpense[];
    loading: boolean;
    error: string | null;
    fetchExpenses: (filters?: ExpenseFilters) => Promise<void>;
    addExpense: (expenseData: ExpenseFormData) => Promise<void>;
    deleteExpense: (expense: MonthlyExpense) => Promise<void>;
    updateExpense: (ExpenseId: number, ExpenseData: ExpenseFormData) => Promise<void>;
    markAsPaid: (expense: MonthlyExpense) => Promise<void>;
}

export const useExpensesStore = create<ExpensesState>((set, get) => ({
    expenses: [],
    loading: false,
    error: null,
    fetchExpenses: async (filters = {}) => {
        set({ error: null, loading: true });
        try {
            const response = await api.get<MonthlyExpense[]>('/monthly-view/', {
                params: filters
            });
            set({ expenses: response.data, loading: false });
        } catch (error) {
            const errorMessage = 'Não foi possível carregar as despesas';
            set({ error: errorMessage, loading: false });
            toast.error(errorMessage);
        }
    },
    addExpense: async (expenseData) => {
        const promise = api.post('/expenses/', expenseData);
        await toast.promise(promise, {
            loading: 'Registrando Despesa...',
            success: 'Despesa Registrada com Sucesso!',
            error: 'Não foi possível registrar a Despesa'
        });
        await get().fetchExpenses();
    },
    deleteExpense: async (expenseDeleted) => {
        const promise = api.delete(`/expenses/${expenseDeleted.id}/`)
        await toast.promise(promise, {
            loading: 'Deletando Despesa...',
            success: 'Despesa Deletada com Sucesso!',
            error: 'Não foi possível Deletar a Despesa'
        });
        set(state => ({
            expenses: state.expenses.filter(expense => expense.id !== expenseDeleted.id)
        }))
        await get().fetchExpenses();
    },
    updateExpense: async (expenseId, expenseData) => {
        const promise = api.put(`/expenses/${expenseId}/`, expenseData)
        await toast.promise(promise, {
            loading: 'Atualizando Despesa...',
            success: 'Despesa Atualizada com Sucesso',
            error: 'Não foi Possivel Atualizar a Despesa'
        });
        await get().fetchExpenses()
    },
    markAsPaid: async (expenseMark) => {
        const promise = api.patch(`/expenses/${expenseMark.id}/`, {
            paid: true
        })
        await toast.promise(promise, {
            loading: 'Atualizando Despesa',
            success: 'Despesa Marcada como Paga',
            error: 'Não foi possivel marcar a Despesa como Paga'
        });
        await get().fetchExpenses();
    }
}));



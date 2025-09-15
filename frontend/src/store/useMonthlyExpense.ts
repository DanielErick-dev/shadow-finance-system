import toast from "react-hot-toast";
import api from "@base/lib/api";
import { create } from "zustand";
import { MonthlyExpense } from "@base/types/expenses";

type ExpenseFilters = {
    due_date__year?: number | string;
    due_date__month?: number | string;
    search?: string;
}

type MonthlyExpenseState = {
    loading: boolean;
    error: null | string;
    expenses: MonthlyExpense[];
    fetchExpenses: (filters: ExpenseFilters) => Promise<void>;
}

export const UseMonthLyExpenseStore = create<MonthlyExpenseState>((set, get) => ({
    loading: false,
    error: null,
    expenses: [],
    fetchExpenses: async (filters = {}) => {
        set({ loading: true, error: null})
        try{
            const response = await api.get<MonthlyExpense[]>('/monthly-view/', {
                params: filters
            })
            set({ expenses: response.data, loading: false})
        } catch (error){
            const errorMessage = 'não foi possivel obter os dados das despesas do mês'
            set({ error: errorMessage, loading: false})
            toast.error(errorMessage)
        }
    },

}))
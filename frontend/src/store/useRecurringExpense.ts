import { create } from "zustand";
import { 
    MonthlyExpense, 
    NewRecurringExpense, 
    RecurringExpense, 
    PaidRecurringExpenseData 
} from "@base/types/expenses";
import toast from "react-hot-toast";
import api from "@base/lib/api";

type State = {
    loading: boolean;
    error: string | null;
    recurringExpenses: RecurringExpense[];
}

type Actions = {
    fetchRecurringExpenses: () => Promise<void>;
    addRecurringExpenses: (recurringExpenseData: NewRecurringExpense) => Promise<void>;
    createPaidInstance: (instance: MonthlyExpense) => Promise<void>;
    deleteRecurringExpense: (instance: RecurringExpense) => Promise<void>;
    updateRecurringExpense: (expenseId: number, instance: NewRecurringExpense) => Promise<void>;
}

export const useRecurringExpenseStore = create<State & Actions>((set, get) => ({
    recurringExpenses: [],
    loading: false,
    error: null,
    fetchRecurringExpenses: async () => {
        set({ loading: true, error: null})
        try{
            const response = await api.get<RecurringExpense[]>('/recurring/')
            set({ recurringExpenses: response.data, loading: false})
        } catch(error){
            const errorMessage = 'não foi possivel obter as despesas recorrentes'
            set({ error: errorMessage, loading: false})
            toast.error(errorMessage)
        }
    },
    addRecurringExpenses: async (recurringExpenseData: NewRecurringExpense) => {
        const promise = api.post(`/recurring/`, recurringExpenseData)
        await toast.promise(promise, {
            loading: 'Salvando Contrato de Despesa Recorrente',
            success: 'Contrato Da Despesa Salva com Sucesso',
            error: 'Não foi possivel Salvar o contrato da Despesa',
        });
        await get().fetchRecurringExpenses();
    },
    createPaidInstance: async (instance) => {
        const dueDate = new Date(instance.due_date + 'T00:00:00');
        const dataToPost: PaidRecurringExpenseData = {
            recurring_expense_id: instance.id,
            payment_date: new Date().toISOString().split('T')[0],
            month: dueDate.getMonth() + 1,
            year: dueDate.getFullYear()
        }
        const promise = api.post('/paid-recurring/', dataToPost);
        await toast.promise(promise, {
            loading: 'Registrando Pagamento Recorrente',
            success: 'Pagamento Registrado Com Sucesso',
            error: 'Não foi Possivel registrar o Pagamento da Despesa Recorrente'
        })
    },
    deleteRecurringExpense: async (instance) => {
        const promise = api.delete(`/recurring/${instance.id}/`)
        await toast.promise(promise, {
            loading: 'Deletando Despesa Recorrente...',
            success: 'Despesa Recorrente Deletada Com Sucesso',
            error: 'Não foi Possivel Deletar a Despesa'
        })
        set(state => ({
            recurringExpenses: state.recurringExpenses.filter(expense => expense.id !== instance.id)
        }))
        await get().fetchRecurringExpenses();
    },
    updateRecurringExpense: async (expenseId, instance) => {
        const promise = api.put(`/recurring/${expenseId}/`, instance)
        await toast.promise(promise, {
            loading: 'Editando Despesa Recorrente...',
            success: 'Despesa Recorrente Editada com Sucesso',
            error: 'Não foi Possivel Editar a Despesa'
        })
        await get().fetchRecurringExpenses();
        
    },
}))
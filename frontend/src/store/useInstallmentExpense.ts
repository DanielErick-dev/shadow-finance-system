import api from "@base/lib/api";
import toast from "react-hot-toast";
import { InstallmentExpense, NewInstallmentExpenseData } from "@base/types/expenses";
import { create } from 'zustand';

type InstallmentsExpenseState = {
    installmentsExpenses: InstallmentExpense[];
    loading: boolean;
    error: string | null;
    fetchInstallmentsExpenses: () => Promise<void>;
    addInstallmentsExpenses: (installmentExpenseData: NewInstallmentExpenseData) => Promise<void>;
    deleteInstallmentsExpenses: (installmentExpense: InstallmentExpense) => Promise <void>; 
}
export const useInstallmentsExpenseStore = create<InstallmentsExpenseState>((set, get) => ({
    loading: false,
    error: null,
    installmentsExpenses: [],
    fetchInstallmentsExpenses: async () => {
        set({ error: null, loading: true });
        try{
            const response = await api.get<InstallmentExpense[]>('/installments/');
            set({ installmentsExpenses: response.data, loading: false });
        } catch (error){
            const errorMessage = 'não foi possivel carregar as despesas parceladas';
            set({ error: errorMessage});
            toast.error(errorMessage);
        }
    },
    addInstallmentsExpenses: async (installmentExpenseData) => {
        const promise = api.post('/installments/', installmentExpenseData);
        await toast.promise(promise, {
            loading: 'Salvando Despesa Parcelada...',
            success: 'Despesa Parcelada Criado com Sucesso',
            error: 'Não foi Possivel adicionar as Despesas, tente novamente'
        });
        await get().fetchInstallmentsExpenses();
    },
    deleteInstallmentsExpenses: async (installmentExpense) => {
        const promise = api.delete(`/installments/${installmentExpense.id}/`);
        await toast.promise(promise, {
            loading: 'Deletando Despesa Parcelada...',
            success: 'Despesa Parcelada Deletada Com Sucesso',
            error: 'Não foi Possivel Deletar a Despesa'
        })
        set(state => ({
            installmentsExpenses: state.installmentsExpenses.filter(
                expense => expense.id !== installmentExpense.id
            )
        }))
        await get().fetchInstallmentsExpenses();
    },
}))
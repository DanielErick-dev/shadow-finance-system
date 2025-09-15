"use client"
import { useState, useEffect } from "react";
import { useRecurringExpenseStore } from "@base/store/useRecurringExpense";
import { RecurringExpenseList } from "@base/components/recurring_expenses/RecurringExpenseList";
import { ChevronDown, ChevronUp, Plus } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import AddRecurringExpenseForm from "@base/components/recurring_expenses/AddRecurringExpenseForm";
import { NewRecurringExpense, RecurringExpense } from "@base/types/expenses";
import LoadingComponent from "@base/components/ui/custom/LoadingComponent";
import ErrorComponent from "@base/components/ui/custom/ErrorComponent";
export default function RecurringExpensesPage(){
    const [isFormVisible, setIsFormVisible] = useState<boolean>(false);
    const [expenseToEdit, setExpenseToEdit] = useState<RecurringExpense | null>(null)
    
    const { 
        loading, 
        error, 
        recurringExpenses: expenses, 
        fetchRecurringExpenses, 
        deleteRecurringExpense,
    } = useRecurringExpenseStore();

    const handleAddForm = () => {
        setExpenseToEdit(null);
        setIsFormVisible(true)
    }
    const handleEdit = (Expense: RecurringExpense) => {
        setExpenseToEdit(Expense);
        setIsFormVisible(true);
    }
    const onSuccess = () => {
        setIsFormVisible(false);
        fetchRecurringExpenses();
    }
    const onCancel = () => {
        setIsFormVisible(false);
    }
    useEffect(() => {
        fetchRecurringExpenses();
    }, [fetchRecurringExpenses]);

    if (loading) {
        <LoadingComponent text="CARREGANDO DESPESAS RECORRENTES"/>
  }

  if (error) {
    <ErrorComponent error={error} errorMessage="NÃO FOI POSSÍVEL CARREGAR DESPESAS RECORRENTES"/>
  }
    return(
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800
        to-slate-900 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Despesas Recorrentes</h1>
                        <p className="text-slate-400">
                            Gerencie Suas Despesas que se repetem mensalmente
                        </p>
                    </div>
                    <button
                        onClick={handleAddForm}
                        className="flex items-center gap-2 bg-gradient-to-r from-purple-700
                        to-purple-600 rounded-lg text-white font-semibold hover:from-purple-600 hover:to-purple-500 shadow-lg hover:shadow-purple-500/30 duration-200 active:scale-95 transition-all py-3 px-4"
                    >
                        <Plus className="w-5 h-5" />
                        Nova Despesa
                        {isFormVisible 
                            ? <ChevronUp className="w-4 h-4" />
                            : <ChevronDown className="w-4 h-4" />
                        }
                    </button>
                </div>
            </div>
            <div>
                <AnimatePresence>
                    {isFormVisible && (
                        <motion.div
                            initial={{ opacity: 0, y: -20}}
                            animate={{ opacity: 1, y: 0}}
                            exit={{ opacity: 0, y: -20}}
                            transition={{ duration: 0.3}}
                            className="mb-8"
                        >
                            <AddRecurringExpenseForm 
                                onSuccess={onSuccess}
                                onCancel={onCancel}
                                initialData={expenseToEdit}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
           <RecurringExpenseList
            expenses={expenses}
            onDelete={deleteRecurringExpense}
            onEdit={handleEdit}
           />
        </div>
    )
}
"use client"
import type { MonthlyExpense, NewRecurringExpense, RecurringExpense } from "@base/types/expenses"
import { Calendar, DollarSign, Edit, Trash2, Tag, Repeat, Play, Pause } from "lucide-react"
import { useConfirmation } from "@base/contexts/ConfirmationDialogContext";

type Props = {
  expenses: RecurringExpense[];
  onDelete: (expenseToDeleted: RecurringExpense) => Promise<void>;
  onEdit: (ExpenseToEdit: RecurringExpense) => void;
}

export function RecurringExpenseList({ expenses, onDelete, onEdit }: Props) {
    const { confirm } = useConfirmation();

    const handleDeleteRecurringExpense = async (expense: RecurringExpense) => {
        if(!expense) return;
        const isConfirmed = await confirm({
            title: '[CONFIRMA EXCLUSÃO ]',
            description: `voce realmente deseja excluir a despesa: ${expense.name}?`,
            confirmText: 'Sim, Excluir',
            cancelText: 'Não, Manter'
        })
        if(isConfirmed){
            await onDelete(expense)
        }
    }
    if (expenses.length === 0) {
        return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
            <Repeat className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-300 mb-2">Nenhuma despesa recorrente encontrada</h3>
            <p className="text-slate-500 max-w-md">
            Suas despesas recorrentes aparecerão aqui quando você adicionar algumas.
            </p>
        </div>
        )
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
        {expenses.map((expense) => (
            <div
            key={expense.id}
            className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 hover:border-purple-500/30"
            >
            
            <div
                className={`absolute top-0 left-0 right-0 h-1 rounded-t-2xl ${
                expense.active
                    ? "bg-gradient-to-r from-green-500 to-emerald-500"
                    : "bg-gradient-to-r from-slate-500 to-slate-600"
                }`}
            />

            
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-slate-200 text-lg leading-tight break-words">{expense.name}</h3>
                </div>

                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-2">
                <button
                    onClick={() => onEdit(expense)}
                    title="Editar despesa recorrente"
                    className="p-2 rounded-lg bg-slate-700/50 hover:bg-blue-600/20 hover:text-blue-400 text-slate-400 transition-colors duration-200"
                >
                    <Edit className="w-4 h-4" />
                </button>
                <button
                    onClick={() => handleDeleteRecurringExpense(expense)}
                    title="Deletar despesa recorrente"
                    className="p-2 rounded-lg bg-slate-700/50 hover:bg-red-600/20 hover:text-red-400 text-slate-400 transition-colors duration-200"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
                </div>
            </div>

            
            <div className="flex items-center gap-2 mb-4">
                <DollarSign className="w-5 h-5 text-green-400" />
                <span className="text-2xl font-bold text-green-400">
                R$ {Number(expense.amount).toFixed(2).replace(".", ",")}
                </span>
            </div>

            
            {expense.category && (
                <div className="flex items-center gap-2 mb-3">
                <Tag className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-300 bg-slate-700/50 px-2 py-1 rounded-md">
                    {expense.category.name}
                </span>
                </div>
            )}

            
            <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-400">Início:</span>
                <span className="text-sm text-slate-300">{new Date(expense.start_date).toLocaleDateString("pt-BR")}</span>
                </div>

                {expense.end_date && (
                <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-400">Fim:</span>
                    <span className="text-sm text-slate-300">{new Date(expense.end_date).toLocaleDateString("pt-BR")}</span>
                </div>
                )}
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                {expense.active ? (
                    <>
                    <Play className="w-4 h-4 text-green-400" />
                    <span className="text-xs font-medium text-green-400 bg-green-400/10 px-2 py-1 rounded-full">
                        ATIVO
                    </span>
                    </>
                ) : (
                    <>
                    <Pause className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-medium text-slate-400 bg-slate-400/10 px-2 py-1 rounded-full">
                        INATIVO
                    </span>
                    </>
                )}
                </div>
            </div>
            </div>
        ))}
        </div>
    )
}

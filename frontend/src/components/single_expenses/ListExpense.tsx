"use client"

import type { Expense, MonthlyExpense } from "@base/types/expenses"
import { Pencil, Trash2, Calendar, Tag, CheckCircle, CreditCard, Repeat } from "lucide-react"
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from "@base/components/ui/tooltip"
import { useConfirmation } from "@base/contexts/ConfirmationDialogContext"

type ExpenseCardProps = {
  expense: MonthlyExpense;
  markAsPaid: (expenseToMark: MonthlyExpense) => Promise<void>
  deleteExpense: (expenseToDeleted: MonthlyExpense) => Promise<void>
  editExpense: (expense: MonthlyExpense) => void
}

function ExpenseCard({ expense, markAsPaid, deleteExpense, editExpense }: ExpenseCardProps) {
  const isPaid = expense.paid
  const isRecurring = expense.is_recurring
  const isInstallment = expense.installment_origin
  const isEditable = !isRecurring && !isInstallment

  const getStatusColor = () => {
    return "from-slate-900/80 to-slate-800/80 border-slate-700/50"
  }

  const getStatusIndicator = () => {
    if (isPaid) return "bg-gradient-to-r from-green-500 to-emerald-500"
    return "bg-gradient-to-r from-purple-500 to-blue-500"
  }

  return (
    <div className="group relative">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-all duration-500"></div>

      <div
        className={`relative bg-gradient-to-br ${getStatusColor()} backdrop-blur-xl border rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-purple-500/10 flex flex-col h-full`}
      >
        <div className={`h-1 ${getStatusIndicator()}`}></div>

        <div className="p-5 flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1 min-w-0 pr-2">
              <h3 className="text-base font-bold text-slate-100 mb-2 leading-tight break-words" title={expense.name}>
                {expense.name}
              </h3>

              <div className="flex flex-wrap gap-2 mb-2">
                {isRecurring && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-orange-500/20 to-amber-500/20 text-orange-300 border border-orange-500/30">
                    <Repeat className="w-3 h-3" />
                    RECORRENTE
                  </span>
                )}
                {isInstallment && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 border border-blue-500/30">
                    <CreditCard className="w-3 h-3" />
                    PARCELA
                  </span>
                )}
              </div>

              {expense.category && (
                <div className="flex items-center gap-1.5 text-xs text-purple-300/80">
                  <Tag className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate font-medium">{expense.category.name}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
              {isEditable && (
                <>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => editExpense(expense)}
                          className="p-1.5 rounded-lg hover:bg-slate-700/50 transition-colors"
                          title="Editar Despesa"
                        >
                          <Pencil className="w-3.5 h-3.5 text-slate-400 hover:text-blue-400" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="top">Editar Despesa</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          onClick={() => deleteExpense(expense)}
                          className="p-1.5 rounded-lg hover:bg-slate-700/50 transition-colors"
                          title="Deletar Despesa"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-slate-400 hover:text-red-400" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent side="top">Deletar Despesa</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </>
              )}

              {!expense.paid && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => markAsPaid(expense)}
                        className="p-1.5 rounded-lg hover:bg-slate-700/50 transition-colors"
                        title="Marcar Como Paga"
                      >
                        <CheckCircle className="w-3.5 h-3.5 text-slate-400 hover:text-green-400" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top">Marcar Como Paga</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                <span className="font-medium">Vencimento:</span>
              </div>
              <span className="text-slate-300 font-mono">
                {new Date(expense.due_date + "T00:00:00").toLocaleDateString("pt-BR", {
                  timeZone: "UTC",
                  day: "2-digit",
                  month: "2-digit",
                  year: "2-digit",
                })}
              </span>
            </div>

            {expense.payment_date && (
              <div className="flex items-center gap-2 text-xs text-green-400">
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="font-medium">Pagamento:</span>
                </div>
                <span className="text-green-300 font-mono">
                  {new Date(expense.payment_date + "T00:00:00").toLocaleDateString("pt-BR", {
                    timeZone: "UTC",
                    day: "2-digit",
                    month: "2-digit",
                    year: "2-digit",
                  })}
                </span>
              </div>
            )}
          </div>

          <div className="mt-auto space-y-3">
            <div className="text-center">
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                R$ {Number(expense.amount).toFixed(2)}
              </div>
            </div>

            <div className="flex items-center justify-center">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${
                  isPaid
                    ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-300 border border-green-500/30"
                    : "bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-300 border border-purple-500/30"
                }`}
              >
                {isPaid ? (
                  <>
                    <CheckCircle className="w-3 h-3" />
                    CONCLUÍDA
                  </>
                ) : (
                  <>
                    <CreditCard className="w-3 h-3" />
                    PENDENTE
                  </>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

type ExpenseListProps = {
  expenses: MonthlyExpense[]
  onMarkAsPaid: (expenseId:MonthlyExpense) => Promise<void>
  onDeleteExpense: (expense:MonthlyExpense) => Promise<void>
  onEditExpense: (expense: MonthlyExpense) => void
}

export default function ExpenseList({ expenses, onMarkAsPaid, onDeleteExpense, onEditExpense }: ExpenseListProps) {
  const { confirm } = useConfirmation()

  if (!expenses || expenses.length === 0) {
    return (
      <div className="relative">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-slate-600/10 to-slate-500/10 rounded-2xl blur"></div>
        <div className="relative text-center py-16 rounded-2xl bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-xl border border-slate-700/50">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
            <CreditCard className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-300 mb-2">Nenhuma Despesa Encontrada</h3>
          <p className="text-sm text-slate-500">Nenhuma despesa corresponde aos filtros selecionados.</p>
        </div>
      </div>
    )
  }

  const handleDeleteExpense = async (expenseToDeleted: MonthlyExpense) => {
    if (!expenseToDeleted) return
    const isConfirmed = await confirm({
      title: "[ CONFIRMA EXCLUSÃO ]",
      description: `voce realmente deseja excluir a despesa: ${expenseToDeleted.name}`,
      confirmText: "Sim, Excluir",
      cancelText: "Não, Manter",
    })
    if (isConfirmed) {
      await onDeleteExpense(expenseToDeleted)
    }
  }

  const handleMarkAsPaid = async (expenseToMark: MonthlyExpense) => {
    if (!expenseToMark) return
    const isConfirmed = await confirm({
      title: " [ CONFIRMA ATUALIZAÇÃO ]",
      description: `voce realmente deseja marcar a despesa: ${expenseToMark.name} como paga?`,
      confirmText: "Sim, Marcar como Pago",
      cancelText: "Não, Não Marcar",
    })
    if (isConfirmed) {
      await onMarkAsPaid(expenseToMark)
    }
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {expenses.map((expense) => (
        <ExpenseCard
          key={expense.id}
          expense={expense}
          markAsPaid={handleMarkAsPaid}
          deleteExpense={handleDeleteExpense}
          editExpense={onEditExpense}
        />
      ))}
    </div>
  )
}

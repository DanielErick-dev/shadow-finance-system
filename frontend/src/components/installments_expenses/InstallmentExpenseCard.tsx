"use client"
import type { InstallmentExpense } from "@base/types/expenses"
import { Trash2, Calendar, CreditCard, DollarSign } from "lucide-react"

type InstallmentExpenseCardProps = {
  installmentExpense: InstallmentExpense
  onDeleteInstallmentExpense: (installmentExpenseToDeleted: InstallmentExpense) => void;
}

export default function InstallmentExpenseCard({ installmentExpense, onDeleteInstallmentExpense }: InstallmentExpenseCardProps) {
  const installmentAmount = Number(installmentExpense.total_amount) / Number(installmentExpense.installments_quantity)

  return (
    <div className="group relative bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden transition-all duration-300 hover:border-purple-500/60 hover:shadow-xl hover:shadow-purple-500/20 hover:scale-[1.02] cursor-pointer">
      <div className="p-4 pb-3">
        <div className="flex justify-between items-start gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-bold text-slate-100 truncate leading-tight" title={installmentExpense.name}>
              {installmentExpense.name}
            </h3>
            {installmentExpense.category && (
              <div className="mt-1.5 flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-purple-400/80"></div>
                <span className="text-xs text-purple-300/90 font-medium truncate">
                  {installmentExpense.category.name}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button 
              className="p-1.5 rounded-lg hover:bg-slate-700/50 transition-colors"
              title="Deletar"
              onClick={() => onDeleteInstallmentExpense(installmentExpense)}
            >
              <Trash2 className="w-3.5 h-3.5 text-slate-400 hover:text-red-400" />
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 pb-3">
        <div className="flex items-baseline gap-2">
          <DollarSign className="w-4 h-4 text-emerald-400 mt-0.5" />
          <span className="text-2xl font-bold text-emerald-400 font-mono">
            R$ {Number(installmentExpense.total_amount).toFixed(2)}
          </span>
        </div>
      </div>

      <div className="px-4 pb-4">
        <div className="bg-slate-800/60 rounded-xl p-3 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-xs text-slate-400 font-medium">Parcelas</span>
            </div>
            <span className="text-sm font-bold text-blue-400 font-mono">
              {installmentExpense.installments_quantity}x
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Valor/parcela</span>
            <span className="text-sm font-semibold text-slate-200 font-mono">R$ {installmentAmount.toFixed(2)}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-purple-400" />
              <span className="text-xs text-slate-400 font-medium">Primeiro venc.</span>
            </div>
            <span className="text-sm font-semibold text-purple-300 font-mono">
              {new Date(installmentExpense.first_due_date + "T00:00:00").toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                timeZone: "UTC",
              })}
            </span>
          </div>
        </div>
      </div>

      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500 opacity-60"></div>
    </div>
  )
}

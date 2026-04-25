"use client"
import { useState } from "react"
import { useInstallments } from "@base/hooks/useInstallments"
import InstallmentExpenseGrid from "@base/components/installments_expenses/InstallmentExpenseGrid"
import { AnimatePresence, motion } from "framer-motion"
import AddInstallmentExpenseForm from "@base/components/installments_expenses/AddInstallmentExpenseForm"
import LoadingComponent from "@base/components/ui/custom/LoadingComponent";
import ErrorComponent from "@base/components/ui/custom/ErrorComponent";

export default function InstallmentsPage() {
  const { installments, isLoading, isError } = useInstallments()
  const [isAdding, setIsAdding] = useState<boolean>(false)

  if (isLoading) {
      return (
          <LoadingComponent text="CARREGANDO DIVIDENDOS"/>
      )
  }
  if (isError) {
      return (
          <ErrorComponent error="Erro de conexão" errorMessage="NÃO FOI POSSIVEL CARREGAR OS DIVIDENDOS"/>
      )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="w-full">
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-slate-100 mb-2">Despesas Parceladas</h2>
                <p className="text-slate-400 text-sm">
                  {installments.length} {installments.length === 1 ? "despesa" : "despesas"} cadastrada{installments.length === 1 ? "" : "s"}
                </p>
              </div>
              <div className="flex-shrink-0">
                <button
                  onClick={() => setIsAdding(true)}
                  className="w-full sm:w-auto flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-2 rounded-lg text-white font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
                >
                  Nova Compra
                </button>
              </div>
            </div>
          </div>
          <AnimatePresence>
            {isAdding && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="mb-8"
              >
                <AddInstallmentExpenseForm
                  onSaveSuccess={() => setIsAdding(false)}
                  onCancel={() => setIsAdding(false)}
                />
              </motion.div>
            )}
          </AnimatePresence>
          <InstallmentExpenseGrid installmentExpenses={installments} />
        </div>
      </div>
    </main>
  )
}

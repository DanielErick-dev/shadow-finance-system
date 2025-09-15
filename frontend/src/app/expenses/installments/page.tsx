"use client"
import { useState, useEffect } from "react"
import { useInstallmentsExpenseStore } from "@base/store/useInstallmentExpense"
import InstallmentExpenseGrid from "@base/components/installments_expenses/InstallmentExpenseGrid"
import { AnimatePresence, motion } from "framer-motion"
import AddInstallmentExpenseForm from "@base/components/installments_expenses/AddInstallmentExpenseForm"

export default function InstallmentsPage() {
  const { error, loading, fetchInstallmentsExpenses, installmentsExpenses } =
    useInstallmentsExpenseStore()
  const [isAdding, setISAdding] = useState<boolean>(false)

  useEffect(() => {
    fetchInstallmentsExpenses()
  }, [fetchInstallmentsExpenses])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-lg text-purple-400 animate-pulse">
        [ Carregando Contratos Parcelados...]
      </div>
    )
  }
  if (error) {
    return <div className="text-center p-10 text-red-400">[ ERRO: {error} ]</div>
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
                  {installmentsExpenses.length} {installmentsExpenses.length === 1 ? "despesa" : "despesas"} cadastrada
                  {installmentsExpenses.length === 1 ? "" : "s"}
                </p>
              </div>
              <div className="flex-shrink-0">
                <button
                  onClick={() => setISAdding(true)}
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
                  onSaveSuccess={() => setISAdding(false)}
                  onCancel={() => setISAdding(false)}
                />
              </motion.div>
            )}
          </AnimatePresence>
          <InstallmentExpenseGrid installmentExpenses={installmentsExpenses} />
        </div>
      </div>
    </main>
  )
}

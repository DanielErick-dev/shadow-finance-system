"use client"

import { useMemo, useState } from "react"
import type React from "react"

import { ChevronDown, ChevronUp, Search, X, Calendar, Filter } from "lucide-react"

import type { Expense, MonthlyExpense } from "@base/types/expenses"

import { useExpenses } from "@base/hooks/useExpenses"

import { Skeleton } from "@base/components/ui/custom/Skeleton"
import ErrorComponent from "@base/components/ui/custom/ErrorComponent"
import ExpenseList from "@base/components/single_expenses/ListExpense"
import AddExpenseModalWrapper from "@base/components/single_expenses/AddExpenseModalWrapper"
import EditExpenseModalWrapper from "@base/components/single_expenses/EditExpenseModalWrapper"

type StatusFilter = "all" | "pending" | "paid"
type ExpenseTypeFilter = "all" | "recurring" | "simple" | "installment"

const monthsOfYear = [
  { value: "01", name: "janeiro" },
  { value: "02", name: "fevereiro" },
  { value: "03", name: "março" },
  { value: "04", name: "abril" },
  { value: "05", name: "maio" },
  { value: "06", name: "junho" },
  { value: "07", name: "julho" },
  { value: "08", name: "agosto" },
  { value: "09", name: "setembro" },
  { value: "10", name: "outubro" },
  { value: "11", name: "novembro" },
  { value: "12", name: "dezembro" },
]

export default function ExpensesPage() {
  const now = new Date()
  const currentMonthString = (now.getMonth() + 1).toString().padStart(2, "0")
  const currentYearString = now.getFullYear().toString()

  const [isFiltersOpen, setIsFiltersOpen] = useState(true)
  const [searchInput, setSearchInput] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [dateFilters, setDateFilters] = useState({
    due_date__year: currentYearString,
    due_date__month: currentMonthString,
  })
  const availableYears = Array.from({ length: 11 }, (_, i) => (2023 + i).toString())
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const [expenseTypeFilter, setExpenseTypeFilter] = useState<ExpenseTypeFilter>("all")
  const [expenseToEdit, setExpenseToEdit] = useState<Expense | null>(null)

  const filters = {
    due_date__year: dateFilters.due_date__year,
    due_date__month: dateFilters.due_date__month,
    search: searchTerm,
  }

  const { expenses, isLoading, isError, removeExpense, payExpense, payRecurringExpense } = useExpenses(filters)

  const handleSearch = () => setSearchTerm(searchInput)
  const clearSearch = () => { setSearchInput(""); setSearchTerm("") }

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDateFilters({ ...dateFilters, [e.target.name]: e.target.value })
  }

  const handleDeleteExpense = async (expense: MonthlyExpense) => {
    if (expense.is_recurring || expense.installment_origin) return;
    await removeExpense.mutateAsync(expense.id)
  }

  const handleMarkAsPaid = async (expense: MonthlyExpense) => {
    if (!expense.is_recurring) {
      await payExpense.mutateAsync(expense.id)
    } else {
      await payRecurringExpense.mutateAsync(expense)
    }
  }

  const clearFilters = () => {
    setDateFilters({ due_date__year: currentYearString, due_date__month: currentMonthString })
    setStatusFilter("all")
    setExpenseTypeFilter("all")
  }

  const filteredExpenses = useMemo(() => {
    let filtered = expenses

    if (searchTerm) {
      filtered = filtered.filter((e) => e.name.toLowerCase().includes(searchTerm.toLowerCase()))
    }
    if (statusFilter === "pending") filtered = filtered.filter((e) => !e.paid)
    else if (statusFilter === "paid") filtered = filtered.filter((e) => e.paid)

    if (expenseTypeFilter !== 'all') {
      filtered = filtered.filter((e) => {
        if (expenseTypeFilter === 'recurring') return e.is_recurring;
        if (expenseTypeFilter === 'installment') return e.installment_origin !== null;
        if (expenseTypeFilter === 'simple') return !e.is_recurring && e.installment_origin === null;
        return true;
      })
    }

    return filtered
  }, [expenses, searchTerm, statusFilter, expenseTypeFilter])

  if (isLoading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-slate-900/95 border border-slate-700/50 rounded-2xl p-6 space-y-4">
          <Skeleton className="h-10 w-full rounded-xl" />
          <div className="flex gap-3">
            <Skeleton className="h-10 w-32 rounded-xl" />
            <Skeleton className="h-10 w-32 rounded-xl" />
          </div>
        </div>
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-slate-900/95 border border-slate-700/50 rounded-xl p-4 flex justify-between items-center">
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="h-6 w-20" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
  if (isError) return <ErrorComponent error="Erro de conexão" errorMessage="NÃO FOI POSSÍVEL CARREGAR AS DESPESAS" />
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
          <div className="relative bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
            <div className="flex flex-col lg:flex-row items-center gap-4 mb-6">
              <div className="relative flex-1 w-full">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-slate-400" />
                </div>
                <input type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
                  className="block w-full pl-12 pr-4 py-3 text-sm bg-slate-800/50 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200"
                  placeholder="Buscar despesas por nome..."
                />
              </div>
              <div className="flex items-center gap-3 w-full lg:w-auto">
                <button onClick={handleSearch}
                  className="flex-1 lg:flex-none px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-medium rounded-xl shadow-lg hover:shadow-purple-500/25 transition-all duration-200 active:scale-95"
                >
                  Buscar
                </button>
                {(searchInput || searchTerm) && (
                  <button onClick={clearSearch}
                    className="flex-1 lg:flex-none px-4 py-3 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/50 rounded-xl text-white transition-all duration-200 hover:shadow-lg active:scale-95 flex items-center justify-center gap-2"
                  >
                    <X className="h-4 w-4" />
                    <span className="hidden sm:inline">Limpar</span>
                  </button>
                )}
                <button onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                  className="flex-none p-3 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 rounded-xl transition-all duration-200 hover:shadow-lg active:scale-95"
                >
                  {isFiltersOpen ? <ChevronUp className="h-5 w-5 text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
                </button>
                <div className="w-full lg:w-auto">
                  <AddExpenseModalWrapper />
                </div>
              </div>
            </div>

            {isFiltersOpen && (
              <div className="border-t border-slate-700/50 pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <Filter className="h-5 w-5 text-purple-400" />
                  <h3 className="text-lg font-semibold text-white">Filtros</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                      <Calendar className="h-4 w-4" /> Ano
                    </label>
                    <select name="due_date__year" value={dateFilters.due_date__year} onChange={handleFilterChange}
                      className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200"
                    >
                      {availableYears.map((year) => (
                        <option key={year} value={year} className="bg-slate-800">{year}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Mês</label>
                    <select name="due_date__month" value={dateFilters.due_date__month} onChange={handleFilterChange}
                      className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200"
                    >
                      {monthsOfYear.map((month) => (
                        <option key={month.value} value={month.value} className="bg-slate-800">
                          {month.name.charAt(0).toUpperCase() + month.name.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-slate-300">Status</label>
                    <div className="flex flex-wrap gap-2">
                      {(["all", "pending", "paid"] as StatusFilter[]).map((s) => (
                        <button key={s} onClick={() => setStatusFilter(s)}
                          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 active:scale-95 ${
                            statusFilter === s
                              ? s === "pending" ? "bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg"
                                : s === "paid" ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg"
                                : "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                              : "bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 hover:text-white border border-slate-600/50"
                          }`}
                        >
                          {s === "all" ? `Todas (${expenses.length})` : s === "pending" ? `Pendentes (${expenses.filter(e => !e.paid).length})` : `Concluídas (${expenses.filter(e => e.paid).length})`}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mb-6">
                  <label className="text-sm font-medium text-slate-300 mb-3 block">Tipo de Despesa</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {(["all", "recurring", "simple", "installment"] as ExpenseTypeFilter[]).map((t) => {
                      const labels: Record<ExpenseTypeFilter, string> = { all: "Todas", recurring: "Recorrentes", simple: "Simples", installment: "Parceladas" }
                      const counts: Record<ExpenseTypeFilter, number> = {
                        all: expenses.length,
                        recurring: expenses.filter(e => e.is_recurring).length,
                        simple: expenses.filter(e => !e.is_recurring && e.installment_origin === null).length,
                        installment: expenses.filter(e => e.installment_origin !== null).length,
                      }
                      return (
                        <button key={t} onClick={() => setExpenseTypeFilter(t)}
                          className={`px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 active:scale-95 ${
                            expenseTypeFilter === t
                              ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/25"
                              : "bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 hover:text-white border border-slate-600/50"
                          }`}
                        >
                          {labels[t]}
                          <div className="text-xs opacity-75 mt-1">({counts[t]})</div>
                        </button>
                      )
                    })}
                  </div>
                </div>
                <div className="flex justify-end">
                  <button onClick={clearFilters}
                    className="px-6 py-2 bg-slate-700/50 hover:bg-slate-600/50 border border-slate-600/50 rounded-xl text-white font-medium transition-all duration-200 hover:shadow-lg active:scale-95"
                  >
                    Limpar Filtros
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-2xl blur opacity-75"></div>
          <div className="relative bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full animate-pulse"></div>
                <h2 className="text-xl font-semibold text-white">Despesas</h2>
              </div>
              <div className="text-sm text-slate-400 font-mono bg-slate-800/50 px-3 py-1 rounded-lg">
                {filteredExpenses.length} {filteredExpenses.length === 1 ? "despesa" : "despesas"}
              </div>
            </div>
            <ExpenseList
              expenses={filteredExpenses}
              onMarkAsPaid={handleMarkAsPaid}
              onEditExpense={setExpenseToEdit}
              onDeleteExpense={handleDeleteExpense}
            />
            <EditExpenseModalWrapper
              expenseToEdit={expenseToEdit}
              onClose={() => setExpenseToEdit(null)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

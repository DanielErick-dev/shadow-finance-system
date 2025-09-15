"use client"

import type React from "react"

import { useEffect, useState } from "react"
import type { NewRecurringExpense, RecurringExpense } from "@base/types/expenses"
import { useRecurringExpenseStore } from "@base/store/useRecurringExpense"
import { X, Save } from "lucide-react"
import { useCategoryStore } from "@base/store/useCategoryStore"
import { Input } from "@base/components/ui/input"
import { Label } from "@base/components/ui/label"

type Props = {
  onSuccess: () => void
  onCancel: () => void
  initialData?: RecurringExpense | null
}

export default function AddRecurringExpenseForm({ onSuccess, onCancel, initialData }: Props) {
  const { addRecurringExpenses, updateRecurringExpense } = useRecurringExpenseStore()
  const { categories, fetchCategories } = useCategoryStore()
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const [formData, setFormData] = useState<NewRecurringExpense>({
    name: "",
    amount: "",
    category_id: null,
    due_day: 1,
    start_date: new Date().toISOString().split("T")[0],
    end_date: null,
    active: true,
  })

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        amount: initialData.amount,
        due_day: initialData.due_day,
        start_date: initialData.start_date,
        end_date: initialData.end_date,
        active: initialData.active,
        category_id: initialData.category?.id || null,
      })
    }
  }, [initialData])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const isCheckbox = type === "checkbox"
    const finalValue = isCheckbox ? (e.target as HTMLInputElement).checked : value

    setFormData((prev) => ({
      ...prev,
      [name]: finalValue,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const dataToSend: NewRecurringExpense = {
      ...formData,
      due_day: Number.parseInt(String(formData.due_day), 10),
      category_id: formData.category_id ? Number.parseInt(String(formData.category_id), 10) : null,
      end_date: formData.end_date || null,
    }

    try {
      if (initialData) {
        await updateRecurringExpense(initialData.id, dataToSend)
      } else {
        await addRecurringExpenses(dataToSend)
      }
      onSuccess()
    } catch (error) {
      console.error("Falha ao salvar despesa recorrente:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-white">
          {initialData ? "Editar Despesa Recorrente" : "Nova Despesa Recorrente"}
        </h3>
        <button
          type="button"
          onClick={onCancel}
          className="text-slate-400 hover:text-purple-400 transition-all duration-200 hover:scale-110 hover:shadow-lg hover:shadow-purple-500/20 rounded-full p-1"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-2">
            Nome
          </Label>
          <Input
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg
                        text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Ex: Aluguel, Internet..."
          />
        </div>
        <div>
          <Label htmlFor="amount" className="block text-sm font-medium text-slate-300 mb-2">
            Valor
          </Label>
          <Input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            min={0}
            required
            step="0.01"
            placeholder="0.00"
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg
                        text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <div>
          <Label htmlFor="category_id" className="block text-sm font-medium text-slate-300 mb-2">
            Categoria
          </Label>
          <select
            name="category_id"
            value={formData.category_id || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 hover:border-purple-400 hover:shadow-md hover:shadow-purple-500/10"
          >
            <option value="">Sem categoria</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label className="block text-sm font-medium text-slate-300 mb-2">Dia do Vencimento</Label>
          <select
            id="due_day"
            name="due_day"
            value={formData.due_day}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 hover:border-purple-400 hover:shadow-md hover:shadow-purple-500/10"
          >
            {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="start_date" className="block text-sm font-medium text-slate-300 mb-2">
            Data de Início
          </Label>
          <Input
            type="date"
            id="start_date"
            name="start_date"
            value={formData.start_date}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
        <div>
          <Label htmlFor="end_date" className="block text-sm font-medium text-slate-300 mb-2">
            Data de Término (opcional)
          </Label>
          <Input
            type="date"
            id="end_date"
            name="end_date"
            value={formData.end_date || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700 hover:border-purple-500/30 transition-all duration-200">
        <div className="relative">
          <Input
            type="checkbox"
            id="active"
            name="active"
            checked={formData.active}
            onChange={handleChange}
            className="w-5 h-5 bg-slate-700 border-2 border-slate-600 rounded text-purple-500 focus:ring-2 focus:ring-purple-500 focus:ring-offset-0 transition-all duration-200 hover:border-purple-400"
          />
          {formData.active && (
            <div className="absolute inset-0 w-5 h-5 bg-purple-500/20 rounded animate-pulse pointer-events-none"></div>
          )}
        </div>
        <Label htmlFor="active" className="text-slate-300 font-medium cursor-pointer select-none">
          Despesa Ativa
        </Label>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 hover:text-white border border-slate-600 hover:border-slate-500 rounded-lg font-medium transition-all duration-200 hover:shadow-md hover:shadow-slate-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white border border-purple-500 hover:border-purple-400 rounded-lg font-medium transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 hover:scale-105"
        >
          <Save className="w-4 h-4" />
          {isSubmitting ? "Salvando..." : initialData ? "Salvar Alterações" : "Adicionar Despesa"}
        </button>
      </div>
    </form>
  )
}

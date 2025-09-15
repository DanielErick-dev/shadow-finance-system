"use client"

import type React from "react"
import { useState, useEffect} from "react"
import type { NewInstallmentExpenseData } from "@base/types/expenses"
import { useInstallmentsExpenseStore } from "@base/store/useInstallmentExpense"
import { useCategoryStore } from "@base/store/useCategoryStore"
import toast from "react-hot-toast"
import { Label } from "@base/components/ui/label"
import { Input } from "@base/components/ui/input"

type Props = {
  onSaveSuccess: () => void
  onCancel: () => void
}

export default function AddInstallmentExpenseForm({ onSaveSuccess, onCancel }: Props) {
  const { addInstallmentsExpenses } = useInstallmentsExpenseStore()
  const { categories, fetchCategories } = useCategoryStore()
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [formData, setFormData] = useState<NewInstallmentExpenseData>({
    name: "",
    total_amount: "",
    installments_quantity: "",
    first_due_date: new Date().toISOString().split("T")[0],
    category_id: null,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories])
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) return toast.error("o nome da compra é obrigatório.")
    if (Number(formData.total_amount) <= 0) return toast.error("o valor total deve ser positivo")
    if (Number(formData.installments_quantity) <= 1) {
      return toast.error("a quantidade de parcelas deve ser maior que 1")
    }
    setIsSubmitting(true)
    try {
      await addInstallmentsExpenses(formData)
      onSaveSuccess()
    } catch (error) {
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden transition-all duration-300 hover:border-purple-500/60 hover:shadow-xl hover:shadow-purple-500/20">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500 opacity-60"></div>

      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-6">
            Registrar Nova Compra Parcelada
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Label className="text-slate-300 font-medium mb-2 block">Nome Da Compra</Label>
              <Input
                name="name"
                id="name"
                onChange={handleInputChange}
                value={formData.name}
                placeholder="Ex: Notebook Gamer"
                disabled={isSubmitting}
                className="bg-slate-800/60 border-slate-600/50 text-slate-100 placeholder:text-slate-400 focus:border-purple-400 focus:ring-purple-400/20 rounded-xl"
              />
            </div>

            <div>
              <Label htmlFor="total_amount" className="text-slate-300 font-medium mb-2 block">
                Valor Total (R$)
              </Label>
              <Input
                id="total_amount"
                name="total_amount"
                value={formData.total_amount}
                onChange={handleInputChange}
                type="number"
                placeholder="0,00"
                disabled={isSubmitting}
                className="bg-slate-800/60 border-slate-600/50 text-slate-100 placeholder:text-slate-400 focus:border-purple-400 focus:ring-purple-400/20 rounded-xl"
              />
            </div>

            <div>
              <Label htmlFor="installments_quantity" className="text-slate-300 font-medium mb-2 block">
                Nº De Parcelas
              </Label>
              <Input
                id="installments_quantity"
                name="installments_quantity"
                value={formData.installments_quantity}
                onChange={handleInputChange}
                type="number"
                placeholder="12"
                disabled={isSubmitting}
                className="bg-slate-800/60 border-slate-600/50 text-slate-100 placeholder:text-slate-400 focus:border-purple-400 focus:ring-purple-400/20 rounded-xl"
              />
            </div>

            <div>
              <Label htmlFor="first_due_date" className="text-slate-300 font-medium mb-2 block">
                Vencimento da 1º Parcela
              </Label>
              <Input
                id="first_due_date"
                name="first_due_date"
                value={formData.first_due_date}
                onChange={handleInputChange}
                type="date"
                disabled={isSubmitting}
                className="bg-slate-800/60 border-slate-600/50 text-slate-100 focus:border-purple-400 focus:ring-purple-400/20 rounded-xl"
              />
            </div>

            <div>
              <Label htmlFor="category_id" className="text-slate-300 font-medium mb-2 block">
                Categoria
              </Label>
              <select
                name="category_id"
                id="category_id"
                value={formData.category_id ?? ""}
                onChange={handleInputChange}
                disabled={isSubmitting}
                className="w-full px-3 py-2 bg-slate-800/60 border border-slate-600/50 rounded-xl text-slate-100 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="" className="bg-slate-800">
                  Nenhuma
                </option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id} className="bg-slate-800">
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-slate-700/60 hover:bg-slate-600/60 text-slate-200 font-medium rounded-xl transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-purple-500/25"
            >
              {isSubmitting ? "Registrando..." : "Salvar Compra"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

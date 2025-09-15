"use client"
import { useEffect, useState, type FormEvent } from "react";
import type { Category, ExpenseFormData, Expense } from "@base/types/expenses";
import toast from "react-hot-toast";
import { Label } from "@base/components/ui/label";
import { Input } from "@base/components/ui/input";
import { Checkbox } from "@base/components/ui/checkbox";
import { AnimatePresence, motion } from "framer-motion";

type Props = {
    onSave: (formData: ExpenseFormData) => Promise<void>;
    initialData?: Expense | null;
    onCancel: () => void;
    availableCategories: Category[];
    submitButtonText?: string;
    onRequestClose?: () => void;
};

export default function AddExpenseForm({
    onSave,
    onCancel,
    initialData,
    availableCategories,
    submitButtonText = 'Registrar',
    onRequestClose
}: Props){
    const [form, setForm] = useState<ExpenseFormData>({
        name: '',
        amount: '',
        due_date: new Date().toISOString().split('T')[0],
        paid: false,
        payment_date: null,
        category_id: null,
    });
    useEffect(() => {
        if(initialData){
            setForm({
                name: initialData.name,
                amount: String(initialData.amount),
                due_date: initialData.due_date,
                paid: initialData.paid,
                payment_date: initialData.payment_date,
                category_id: initialData.category?.id ?? null
            })
        } else{
            setForm({
                name: '',
                amount: '',
                due_date: new Date().toISOString().split('T')[0],
                paid: false,
                payment_date: null,
                category_id: null,
            })
        }
    }, [initialData])
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name, value, type} = e.target
        if(type === 'checkbox'){
            const isChecked = (e.target as HTMLInputElement).checked;
            setForm(prev => ({
                ...prev,
                paid: isChecked,
                payment_date: isChecked ? new Date().toISOString().split('T')[0] : null,
            }));
        } else{
            setForm(prev => ({
                ...prev,
                [name]: value
            }));
        };
    };
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        console.log('handle submit sendo chamado')
        if(!form.name.trim()){
            toast.error('o nome da despesa é obrigatório');
            return;
        };
        if(form.amount === '' || Number(form.amount) <= 0){
            toast.error('O valor da despesa deve ser positivo');
            return;
        };
        const dataToSave: ExpenseFormData = {
            ...form,
            amount: form.amount,
            category_id: form.category_id ? Number(form.category_id): null,
        };
        await onSave(dataToSave);
        onRequestClose?.();
    };
    return(
        <form onSubmit={handleSubmit} className="space-y-2 p-1">
            <div className="space-y-2">
                <Label
                    htmlFor="name"
                    className="text-sm font-semibold text-purple-300 block"
                >
                    Nome
                </Label>
                <Input
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleInputChange}
                    className="bg-slate-800 border-2 border-slate-700 rounded-lg px-4 py-3
                     text-white placeholer:text-slate-400 focus:border-purple-500 focus:ring-2
                     focus:ring-purple-500/20 transition-all duration-200 w-full "
                    placeholder="Ex: Conta De Luz"
                    required
                />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-2 pt-2">
                    <Label
                        htmlFor="amount"
                        className="text-sm font-semibold text-purple-300 block"
                    >
                        VALOR (R$)
                    </Label>
                    <Input
                        id="amount"
                        name="amount"
                        value={form.amount}
                        onChange={handleInputChange}
                        className="bg-slate-800 border-2 border-slate-700 rounded-lg px-4 py-3
                        text-white placeholer:text-slate-400 focus:border-purple-500 focus:ring-2
                         focus:ring-purple-500/20 transition-all duration-200 w-full "
                        placeholder="150.50"
                        required
                    />
                </div>
                <div className="space-y-2 pt-2">
                    <Label
                        htmlFor="due_date"
                        className="text-sm font-semibold text-purple-300 block"
                    >
                        DATA DE VENCIMENTO
                    </Label>
                    <Input
                        id="due_date"
                        name="due_date"
                        type="date"
                        value={form.due_date}
                        onChange={handleInputChange}
                        className="bg-slate-800 border-2 border-slate-700 rounded-lg px-4 py-3
                        text-white placeholer:text-slate-400 focus:border-purple-500 focus:ring-2
                        focus:ring-purple-500/20 transition-all duration-200 w-full "
                        required
                    />   
                </div>
            </div>
            <div className="space-y-2 pt-2">
                <Label
                    htmlFor="category_id"
                    className="text-sm font-semibold text-purple-300 block"
                >
                    CATEGORIA
                </Label>
                <select
                    id="category_id"
                    name="category_id"
                    value={form.category_id ?? ''}
                    onChange={handleInputChange}
                    className="bg-slate-800 border-2 border-slate-700 rounded-lg px-4 py-3
                     text-white placeholer:text-slate-400 focus:border-purple-500 focus:ring-2
                     focus:ring-purple-500/20 transition-all duration-200 w-full appearance-none cursor-pointer"
                >
                    <option value="">Nenhuma Categoria</option>
                    {availableCategories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>  
            </div>
            <div className="space-y-2 pt-2">
                <div className="flex items-center space-x-2 py-2">
                    <Checkbox 
                        id="paid"
                        name="paid"
                        checked={form.paid}
                        onCheckedChange={(checked) => {
                            const isChecked = !!checked;
                            setForm(prev => ({
                                ...prev,
                                paid: isChecked,
                                payment_date: isChecked ? new Date().toISOString().split('T')[0]: null,
                            }));
                        }}
                        className="border border-slate-600 data-[slate=checked]:bg-purple-600 focus:ring-purple-500 h-5 w-5 rounded text-purple-600"
                    />
                    <Label 
                        htmlFor="paid" 
                        className="text-sm font-medium text-slate-300 cursor-pointer"
                    >
                        Marcar como já paga?
                    </Label>
                </div>
                <AnimatePresence>
                    {form.paid && (
                        <motion.div
                            key="payment_date"
                            initial={{ opacity: 0, height: 0}}
                            animate={{ opacity: 1, height: "auto"}}
                            exit={{ opacity: 0, height: 0}}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                            >
                            <div className="space-y-2 animate-in fade-in duration-300 pl-6 border-1-2 border-purple-500/30 ml-2">
                                <Label
                                    htmlFor="payment_date"
                                    className="text-sm font-semibold text-purple-300 block"
                                >
                                    DATA DE PAGAMENTO
                                </Label>
                                <Input 
                                    id="payment_date"
                                    name="payment_date"
                                    type="date"
                                    value={form.payment_date || ''}
                                    onChange={handleInputChange}
                                    className="bg-slate-800 border-2 border-slate-700 rounded-lg px-4 py-3
                                    text-white placeholer:text-slate-400 focus:border-purple-500 focus:ring-2
                                    focus:ring-purple-500/20 transition-all duration-200 w-full "

                                />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            <div className="flex justify-end gap-4 pt-6 border-t border-slate-700/50 mt-4">
                <button 
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-all duration-200 font-medium border border-slate-600"
                >
                    Cancelar
                </button>
                <motion.button
                    type="submit"
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-all duration-200 font-medium shadow-lg shadow-purple-500/25"
                >
                    {submitButtonText}
                </motion.button>
            </div>
        </form>
    )
}
"use client"
import { useState, useEffect } from "react"
import { type Asset } from "@base/types/assets"
import { ItemInvestiment, OrderType } from "@base/types/investiments"
import toast from "react-hot-toast"
import { Label } from "@base/components/ui/label"
import AddAssetModalWrapper from "../ativos/AddAssetModalWrapper"
import { Input } from "@base/components/ui/input"

export type InvestimentFormData = {
    assetCode: string;
    order_type: OrderType;
    quantity: string;
    unit_price: string;
    operation_date: string;
}

type Props = {
    onSave: (formData: InvestimentFormData) => Promise<void>;
    onCancel: () => void;
    
    submitButtonText?: string;
    availableAssets: Asset[]
    initialData?: Omit<ItemInvestiment, 'id'>; 
}

export function AddInvestimentForm({
    onSave,
    onCancel,
    submitButtonText = 'Adicionar',
    availableAssets,
    initialData
}: Props) {
    const getInitialFormState = (): InvestimentFormData => {
        if(initialData){
            return {
                assetCode: initialData.asset.code,
                unit_price: String(initialData.unit_price),
                order_type: initialData.order_type,
                quantity: String(initialData.quantity),
                operation_date: initialData.operation_date
            }
        }
        return{
            assetCode: availableAssets.length > 0 ? availableAssets[0].code : '',
            unit_price: '',
            order_type: 'BUY',
            quantity: '',
            operation_date: new Date().toISOString().split('T')[0]
        }
    };

    const [form, setForm] = useState<InvestimentFormData>(getInitialFormState());
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setForm(getInitialFormState())
    }, [initialData, availableAssets]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const finalValue = name === 'assetCode' ? value.toUpperCase() : value;
        setForm((prev) => ({
            ...prev,
            [name]: finalValue,
        }));
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.assetCode) {
            toast.error('Por favor, selecione um ativo válido.');
            return;
        }
        if (form.quantity === '' || Number(form.quantity) <= 0) {
            toast.error('A quantidade deve ser maior do que zero.');
            return;
        }
        if (form.unit_price === '' || Number(form.unit_price) <= 0) {
            toast.error('O preço unitário deve ser maior do que zero.');
            return;
        }

        setIsSubmitting(true);
        try {
            await onSave(form);
            onCancel();
        } catch (error) {
            console.error('Não foi possível adicionar o investimento', error);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-slate-800/70 p-4 rounded-lg border border-slate-700"
        >
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                <div className="md:col-span-4">
                    <Label htmlFor="assetCode" className="block text-sm font-medium text-purple-300 mb-1">Ativo</Label>
                    <div className="flex items-center gap-2">
                        <select
                            name="assetCode"
                            id="assetCode"
                            value={form.assetCode}
                            onChange={handleInputChange}
                            required
                            disabled={isSubmitting}
                            className="w-full flex-grow p-2.5 bg-slate-900 border border-slate-600 rounded-md shadow-sm text-white focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                        >
                            <option value="" disabled>Selecione um Ativo</option>
                            {availableAssets.map((asset) => (
                                <option key={asset.id} value={asset.code}>
                                    {asset.code.toUpperCase()} - ({asset.type})
                                </option>
                            ))}
                        </select>
                        <AddAssetModalWrapper />
                    </div>
                </div>

                <div className="md:col-span-2">
                    <Label htmlFor="order_type" className="block text-sm font-medium text-purple-300 mb-1">Tipo de Ordem</Label>
                    <select
                        name="order_type"
                        id="order_type"
                        value={form.order_type}
                        onChange={handleInputChange}
                        disabled={isSubmitting}
                        className="w-full p-2.5 bg-slate-900 border border-slate-600 rounded-md shadow-sm text-white focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                    >
                        <option value="BUY">COMPRA</option>
                        <option value="SELL">VENDA</option>
                    </select>
                </div>

                <div className="md:col-span-2">
                    <Label htmlFor="quantity" className="block text-sm font-medium text-purple-300 mb-1">Quantidade</Label>
                    <Input
                        type="number"
                        id="quantity"
                        name="quantity"
                        value={form.quantity}
                        onChange={handleInputChange}
                        placeholder="10"
                        required
                        disabled={isSubmitting}
                        className="w-full p-2.5 bg-slate-900 border border-slate-600 rounded-md shadow-sm text-white focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                    />
                </div>

                <div className="md:col-span-2">
                    <Label htmlFor="unit_price" className="block text-sm font-medium text-purple-300 mb-1">Preço Unitário</Label>
                    <Input
                        type="number"
                        id="unit_price"
                        name="unit_price"
                        step="0.01"
                        value={form.unit_price}
                        onChange={handleInputChange}
                        placeholder="120.50"
                        required
                        disabled={isSubmitting}
                        className="w-full p-2.5 bg-slate-900 border border-slate-600 rounded-md shadow-sm text-white focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                    />
                </div>

                <div className="md:col-span-2">
                    <Label htmlFor="operation_date" className="block text-sm font-medium text-purple-300 mb-1">Data da Operação</Label>
                    <Input
                        type="date"
                        name="operation_date"
                        id="operation_date"
                        value={form.operation_date}
                        onChange={handleInputChange}
                        required
                        disabled={isSubmitting}
                        className="w-full p-2.5 bg-slate-900 border border-slate-600 rounded-md shadow-sm text-white focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                    />
                </div>
            </div>

            <div className='flex justify-end space-x-3 pt-6 mt-4 border-t border-slate-700'>
                <button type="button" onClick={onCancel} className="px-4 py-2 text-sm bg-slate-700 text-slate-300 rounded-md hover:bg-slate-600 transition-colors">Cancelar</button>
                <button type="submit" disabled={isSubmitting} className="px-5 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-md shadow-md disabled:opacity-50 disabled:cursor-not-allowed">
                    {isSubmitting ? 'Salvando...' : submitButtonText}
                </button>
            </div>
        </form>
    )
}

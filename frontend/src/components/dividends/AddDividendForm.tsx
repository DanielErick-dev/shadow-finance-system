'use client'

import { useState, useEffect } from 'react';
import { type Asset } from '@base/types/assets'
import { type ItemDividend } from '@base/types/dividends';
import AddAssetModalWrapper from '@base/components/ativos/AddAssetModalWrapper';
import toast from 'react-hot-toast';

export type DividendFormData = {
    assetCode: string;
    value: string;
    received_date: string;
}

type Props = {
    onSave: (formData: DividendFormData) => Promise<void>;
    onCancel: () => void;
    initialData?: Omit<ItemDividend, 'id'>;
    submitButtonText?: string;
    availableAssets: Asset[]
}

export function AddDividendForm({
    onSave,
    onCancel, 
    initialData, 
    submitButtonText = 'Adicionar',
    availableAssets
}: Props) {
    const getInitialFormState = (): DividendFormData => {
        if (initialData) {
            return {
                assetCode: initialData.asset.code,
                value: String(initialData.value),
                received_date: initialData.received_date
            };
        }
        return {
            assetCode: availableAssets.length > 0 ? availableAssets[0].code : '',
            value: '',
            received_date: new Date().toISOString().split('T')[0]
        }
    }

    const [form, setForm] = useState<DividendFormData>(getInitialFormState());
    const [isSubmitting, setIsSubmitting] = useState(false);
      
    useEffect(() => {
        setForm(getInitialFormState());
    }, [initialData, availableAssets]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm(prevForm => ({
            ...prevForm,
            [name]: value
        }));
    };
    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (!form.assetCode) {
            toast.error('Por favor, selecione um ativo válido.');
            return;
        }
        if (form.value === '' || Number(form.value) <= 0) {
            toast.error('Por favor, insira um valor positivo para o dividendo.');
            return;
        }

        setIsSubmitting(true);
        try {
            const formDataToSave: DividendFormData = {
                assetCode: form.assetCode,
                value: form.value,
                received_date: form.received_date,
            };
            await onSave(formDataToSave);
            onCancel(); 
        } catch (error) {
            console.error("Falha ao salvar o formulário de dividendo.", error);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className='space-y-4 bg-slate-800/70 p-4 rounded-lg border border-slate-700'>
            <div className='flex justify-between items-center'>
                <label htmlFor='ativoCodigo' className='block text-sm font-medium text-purple-300'>
                    Ativo
                </label>
                <AddAssetModalWrapper />
            </div>
            <select
                id='assetCode'
                name='assetCode'
                value={form.assetCode}
                onChange={handleInputChange}
                className='w-full p-2.5 bg-slate-900 border border-slate-600 rounded-md shadow-sm text-white focus:ring-1 focus:ring-purple-500 focus:border-purple-500'
                required
                disabled={isSubmitting}
            >
                <option value="" disabled>Selecione um ativo</option>
                {availableAssets.map((asset) => (
                    <option 
                        key={asset.id} 
                        value={asset.code}
                    >
                        {asset.code.toUpperCase()} - ({asset.type})
                    </option>
                ))}
            </select>
            
            <div>
                 <label htmlFor='value' className='block text-sm font-medium text-purple-300 mb-1'>Valor (R$)</label>
                 <input 
                    id="value"
                    name="value"
                    type="number"
                    step="0.01"
                    value={form.value}
                    onChange={handleInputChange}
                    className='w-full p-2.5 bg-slate-900 border border-slate-600 rounded-md shadow-sm text-white focus:ring-1 focus:ring-purple-500 focus:border-purple-500'
                    placeholder='120.50'
                    required
                    disabled={isSubmitting}
                 />
            </div>
            
            <div>
                 <label htmlFor='received_date' className='block text-sm font-medium text-purple-300 mb-1'>Data</label>
                 <input 
                    id="received_date"
                    name="received_date"
                    type="date"
                    value={form.received_date}
                    onChange={handleInputChange}
                    className='w-full p-2.5 bg-slate-900 border border-slate-600 rounded-md shadow-sm text-white focus:ring-1 focus:ring-purple-500 focus:border-purple-500'
                    required
                    disabled={isSubmitting}
                 />
            </div>

            <div className='flex justify-end space-x-3 pt-2'>
                <button
                    type="button"
                    onClick={onCancel}
                    className='px-4 py-2 text-sm bg-slate-700 text-slate-300 rounded-md hover:bg-slate-600 transition-colors'
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className='px-5 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-md shadow-md disabled:opacity-50 disabled:cursor-not-allowed'
                >
                    {isSubmitting ? 'Salvando...' : submitButtonText}
                </button>
            </div>
        </form>
    )
}

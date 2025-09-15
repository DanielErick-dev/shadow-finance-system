'use client'
import { type Asset } from "@base/types/assets";
import { ItemDividend, DividendMonth } from "@base/types/dividends";
import { AddDividendForm, type DividendFormData } from "@base/components/dividends/AddDividendForm";
import { useState } from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@base/components/ui/tooltip"
import toast from "react-hot-toast";
import { useConfirmation } from '@base/contexts/ConfirmationDialogContext'

type Props = {
    data: DividendMonth
    onAddDividend: (cardId: number, item: Omit<ItemDividend, 'id'>) => Promise <void>
    onUpdateDividend: (itemId: number, itemData: Omit<ItemDividend, 'id'>) => Promise<void>
    onDeleteDividend: (itemId: number) => Promise<void>
    availableAssets: Asset[]
    onDeleteCard: (cardId: number) => Promise<void>
}
export function DividendCard({ 
    data, 
    onAddDividend, 
    onUpdateDividend,
    onDeleteDividend,
    availableAssets,
    onDeleteCard
}: Props) {
    const nomeMes = new Date(data.year, data.month - 1).toLocaleString('pt-BR', { month: 'long' });
    const [isAdding, setIsAdding] = useState(false)
    const [editingItemId, setEditingItemId] = useState<number | null>(null)
    const { confirm } = useConfirmation()
    
    const handleSaveNewDividend = async (formData: DividendFormData) => {
        const selectedAtivo = availableAssets.find(
            asset => asset.code === formData.assetCode
        );
        
        if (!selectedAtivo) {
            toast.error("Ativo selecionado é inválido. Tente novamente.");
            throw new Error("Ativo inválido");
        }
        const newItemData: Omit<ItemDividend, 'id'> = {
            asset: selectedAtivo,
            value: formData.value,
            received_date: formData.received_date
        };
        await onAddDividend(data.id, newItemData);
    }
    const handleSaveEditedDividend = async (formData: DividendFormData) => {
        if (!editingItemId) return;

        const selectedAtivo = availableAssets.find(
            asset => asset.code === formData.assetCode
        );
        if (!selectedAtivo) {
            toast.error("Ativo selecionado é inválido. Tente novamente.");
            throw new Error("Ativo inválido");
        }

        const updatedItemData: Omit<ItemDividend, 'id'> = {
            asset: selectedAtivo,
            value: formData.value,
            received_date: formData.received_date
        };
        
        await onUpdateDividend(editingItemId, updatedItemData);
    }

    const handleCancelEdit = () => {
        setEditingItemId(null);
    }
    const handleDeleteClick = async (item: ItemDividend) => { 
        const isConfirmed = await confirm({
            title: "[ CONFIRMAR EXCLUSÃO ]",
            description: 'voce realmente deseja excluir o registro do dividendo?',
            confirmText: 'Sim, Excluir',
            cancelText: 'Não, Manter'
        });
        if (isConfirmed) {
            await toast.promise(
                onDeleteDividend(item.id),
                {
                    loading: 'Excluindo dividendo...',
                    success: 'Dividendo excluído com sucesso!',
                    error: 'Não foi possível excluir o dividendo.',
                }
            );
        }
    }
    const handleDeleteCardClick = async (card: DividendMonth) => {
        const isConfirmed = await confirm({
            title: "[ EXCLUIR MÊS INTEIRO ]",
            description: 'Você realmente deseja excluir todos os dividendos deste mês?',
            confirmText: 'Sim, Excluir Tudo',
            cancelText: 'Não, Manter'
        })
        if( isConfirmed) {
            await toast.promise(
                onDeleteCard(card.id),
                {
                    loading: 'Excluindo mês...',
                    success: 'Mês excluído com sucesso!',
                    error: 'Não foi possível excluir o mês.',
                }
            );
        }
    }
    const totalDoMes = data.itens.reduce((sum, item) => sum + Number(item.value), 0)
    
    return (
        <div className="bg-slate-900 rounded-xl shadow-lg shadow-purple-900/20 border border-slate-700 overflow-hidden transition-all duration-300 hover:border-purple-600/50 hover:shadow-purple-600/20">
            <div className="px-5 py-4 border-b border-slate-800 bg-slate-800/50 flex flex-col sm:flex-row justify-between items-center gap-2">
                <h3 className="font-bold text-xl text-slate-200 tracking-wider">
                    <span className="text-purple-400">「</span> {nomeMes.charAt(0).toUpperCase() + nomeMes.slice(1)} / {data.year} <span className="text-purple-400">」</span>
                </h3>
                <div className="flex items-center gap-4">
                    {data.itens.length > 0 && (
                        <p className="text-sm font-semibold text-green-400 px-3 py-1 bg-green-900/30 border border-green-500/30 rounded-full">
                            Total: R$ {totalDoMes.toFixed(2)}
                        </p>
                    )}
                    <TooltipProvider delayDuration={200}>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button
                                    onClick={() => handleDeleteCardClick(data)}
                                    className="p-2 rounded-full text-slate-400 hover:bg-slate-700 hover:text-red-500 transition-colors"
                                    aria-label="Deletar mês"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </TooltipTrigger>
                            <TooltipContent className="bg-slate-800 text-white border-slate-700">
                                <p>Deletar Mês</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                    {!isAdding && !editingItemId && (
                        <button
                            onClick={() => { setIsAdding(true); setEditingItemId(null); }}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2 px-3 rounded-md transition-colors"
                        >
                            + Dividendo
                        </button>
                    )}
                    
                </div>
            </div>

            <div className="p-5">
                {isAdding && (
                    <AddDividendForm
                    onSave={handleSaveNewDividend}
                    onCancel={() => setIsAdding(false)}
                    submitButtonText="Adicionar Dividendo"
                    availableAssets={availableAssets}
                    />
                )}

                {!isAdding && data.itens.length === 0 && (
                    <p className="text-slate-500 italic text-center py-6">
                        Nenhum dividendo registrado para este período.
                    </p>
                )}

                {!isAdding && data.itens.length > 0 && (
                    <ul className="space-y-4">
                        {data.itens.map((item) => (
                            editingItemId === item.id ? (
                                <AddDividendForm
                                key={`edit-${item.id}`}
                                initialData={item}
                                onSave={handleSaveEditedDividend}
                                onCancel={handleCancelEdit}
                                submitButtonText="Salvar Alterações"
                                availableAssets={availableAssets}
                                />
                            ) : (
                                <li
                                    key={item.id}
                                    className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 p-4 bg-slate-800/60 rounded-lg border border-slate-700"
                                >
                                    <div className="flex-grow">
                                        <div className="flex items-center gap-3">
                                            <span className="font-semibold text-lg text-blue-300">{item.asset.code.toUpperCase()}</span>
                                            <span className="text-xs font-medium text-purple-300 bg-purple-900/40 px-2 py-0.5 rounded-full border border-purple-500/30">
                                                {item.asset.type.toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="text-sm text-slate-400 mt-1">
                                            Recebido em: {new Date(item.received_date + 'T00:00:00').toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2 self-end sm:self-center">
                                        <span className="text-xl font-bold text-green-400">
                                            R$ {item.value}
                                        </span>
                                        <button 
                                            onClick={() => setEditingItemId(item.id)} 
                                            className="p-2 rounded-full hover:bg-slate-700 group"
                                        >
                                            <svg className="w-5 h-5 text-slate-400 group-hover:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L14.5 6.536z" /></svg>
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteClick(item)}
                                            className="p-2 rounded-full hover:bg-slate-700 group"
                                        >
                                            <svg className="w-5 h-5 text-slate-400 group-hover:text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </div>
                                </li>
                            )
                        ))}
                    </ul>
                )}
            </div>
        </div>
    )
}
'use client'

import { useState } from 'react'
import { type Asset } from '@base/types/assets'
import { type ItemDividend, type DividendMonth, type NewItemDividend, type EditItemDividend } from '@base/types/dividends'
import { AddDividendForm, type DividendFormData } from '@base/components/dividends/AddDividendForm'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@base/components/ui/tooltip'
import { useConfirmation } from '@base/contexts/ConfirmationDialogContext'
import toast from 'react-hot-toast'

// --- Types ---

type DividendCardProps = {
    data: DividendMonth
    availableAssets: Asset[]
    onAddDividend: (data: NewItemDividend) => Promise<void>
    onUpdateDividend: (itemId: number, data: EditItemDividend) => Promise<void>
    onDeleteDividend: (itemId: number) => Promise<void>
    onDeleteCard: (cardId: number) => Promise<void>
}

type DividendItemRowProps = {
    item: ItemDividend
    onEditClick: (itemId: number) => void
    onDeleteClick: (item: ItemDividend) => void
}

// --- Helpers ---

function buildNewItemPayload(formData: DividendFormData, cardId: number, assets: Asset[]): NewItemDividend | null {
    const asset = assets.find(a => a.code === formData.assetCode)
    if (!asset) return null
    return {
        asset_id: asset.id,
        value: formData.value,
        received_date: formData.received_date,
        card_month: cardId,
    }
}

function buildEditItemPayload(formData: DividendFormData, assets: Asset[]): EditItemDividend | null {
    const asset = assets.find(a => a.code === formData.assetCode)
    if (!asset) return null
    return {
        asset_id: asset.id,
        value: formData.value,
        received_date: formData.received_date,
    }
}

// --- Sub-components ---

function DividendItemRow({ item, onEditClick, onDeleteClick }: DividendItemRowProps) {
    const formattedDate = new Date(item.received_date + 'T00:00:00').toLocaleDateString('pt-BR', { timeZone: 'UTC' })

    return (
        <li className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 p-4 bg-slate-800/60 rounded-lg border border-slate-700">
            <div className="flex-grow">
                <div className="flex items-center gap-3">
                    <span className="font-semibold text-lg text-blue-300">
                        {item.asset.code.toUpperCase()}
                    </span>
                    <span className="text-xs font-medium text-purple-300 bg-purple-900/40 px-2 py-0.5 rounded-full border border-purple-500/30">
                        {item.asset.type}
                    </span>
                </div>
                <p className="text-sm text-slate-400 mt-1">Recebido em: {formattedDate}</p>
            </div>

            <div className="flex items-center space-x-2 self-end sm:self-center">
                <span className="text-xl font-bold text-green-400">
                    R$ {Number(item.value).toFixed(2)}
                </span>
                <button
                    onClick={() => onEditClick(item.id)}
                    className="p-2 rounded-full hover:bg-slate-700 group"
                    aria-label="Editar dividendo"
                >
                    <svg className="w-5 h-5 text-slate-400 group-hover:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L14.5 6.536z" />
                    </svg>
                </button>
                <button
                    onClick={() => onDeleteClick(item)}
                    className="p-2 rounded-full hover:bg-slate-700 group"
                    aria-label="Excluir dividendo"
                >
                    <svg className="w-5 h-5 text-slate-400 group-hover:text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>
        </li>
    )
}

// --- Main component ---

export function DividendCard({
    data,
    availableAssets,
    onAddDividend,
    onUpdateDividend,
    onDeleteDividend,
    onDeleteCard,
}: DividendCardProps) {
    const [isAdding, setIsAdding] = useState(false)
    const [editingItemId, setEditingItemId] = useState<number | null>(null)
    const { confirm } = useConfirmation()

    const monthLabel = new Date(data.year, data.month - 1)
        .toLocaleString('pt-BR', { month: 'long' })
    const capitalizedMonth = monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1)
    const totalDoMes = data.itens.reduce((sum, item) => sum + Number(item.value), 0)

    const handleSaveNew = async (formData: DividendFormData) => {
        const payload = buildNewItemPayload(formData, data.id, availableAssets)
        if (!payload) {
            toast.error('Ativo selecionado é inválido. Tente novamente.')
            return
        }
        await onAddDividend(payload)
        setIsAdding(false)
    }

    const handleSaveEdit = async (formData: DividendFormData) => {
        if (!editingItemId) return
        const payload = buildEditItemPayload(formData, availableAssets)
        if (!payload) {
            toast.error('Ativo selecionado é inválido. Tente novamente.')
            return
        }
        await onUpdateDividend(editingItemId, payload)
        setEditingItemId(null)
    }

    const handleDeleteItem = async (item: ItemDividend) => {
        const confirmed = await confirm({
            title: '[ CONFIRMAR EXCLUSÃO ]',
            description: 'Você realmente deseja excluir este registro de dividendo?',
            confirmText: 'Sim, Excluir',
            cancelText: 'Não, Manter',
        })
        if (confirmed) {
            await onDeleteDividend(item.id)
        }
    }

    const handleDeleteCard = async () => {
        const confirmed = await confirm({
            title: '[ EXCLUIR MÊS INTEIRO ]',
            description: 'Você realmente deseja excluir todos os dividendos deste mês?',
            confirmText: 'Sim, Excluir Tudo',
            cancelText: 'Não, Manter',
        })
        if (confirmed) {
            await onDeleteCard(data.id)
        }
    }

    const editingItem = editingItemId
        ? data.itens.find(i => i.id === editingItemId)
        : undefined

    return (
        <div className="bg-slate-900 rounded-xl shadow-lg shadow-purple-900/20 border border-slate-700 overflow-hidden transition-all duration-300 hover:border-purple-600/50 hover:shadow-purple-600/20">
            {/* Card header */}
            <div className="px-5 py-4 border-b border-slate-800 bg-slate-800/50 flex flex-col sm:flex-row justify-between items-center gap-2">
                <h3 className="font-bold text-xl text-slate-200 tracking-wider">
                    <span className="text-purple-400">「</span>
                    {' '}{capitalizedMonth} / {data.year}{' '}
                    <span className="text-purple-400">」</span>
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
                                    onClick={handleDeleteCard}
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
                            onClick={() => setIsAdding(true)}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs py-2 px-3 rounded-md transition-colors"
                        >
                            + Dividendo
                        </button>
                    )}
                </div>
            </div>

            {/* Card body */}
            <div className="p-5 space-y-4">
                {isAdding && (
                    <AddDividendForm
                        onSave={handleSaveNew}
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
                        {data.itens.map((item) =>
                            editingItemId === item.id ? (
                                <AddDividendForm
                                    key={`edit-${item.id}`}
                                    initialData={editingItem}
                                    onSave={handleSaveEdit}
                                    onCancel={() => setEditingItemId(null)}
                                    submitButtonText="Salvar Alterações"
                                    availableAssets={availableAssets}
                                />
                            ) : (
                                <DividendItemRow
                                    key={item.id}
                                    item={item}
                                    onEditClick={setEditingItemId}
                                    onDeleteClick={handleDeleteItem}
                                />
                            )
                        )}
                    </ul>
                )}
            </div>
        </div>
    )
}

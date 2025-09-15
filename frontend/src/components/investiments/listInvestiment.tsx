"use client"
import { useState } from "react";
import { type Asset } from "@base/types/assets";
import { AddInvestimentForm, InvestimentFormData }from "@base/components/investiments/AddInvestimentForm";
import { ItemInvestiment, CardInvestimentMonth, } from "@base/types/investiments";
import { toast } from "react-hot-toast";
import { Pencil, Trash } from "lucide-react";
import { useConfirmation } from "@base/contexts/ConfirmationDialogContext";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@base/components/ui/tooltip"

type Props = {
    data: CardInvestimentMonth
    onAddInvestiment: (cardId: number, item: Omit<ItemInvestiment, 'id'>) => Promise<void>;
    onUpdateInvestiment: (itemId: number, itemData: Omit<ItemInvestiment, 'id'>) => Promise<void>;
    onDeleteInvestiment: (itemId: number) => Promise<void>;
    onDeleteMonthCard: (cardId: number) => Promise<void>;
    availableAssets: Asset[];
}

type InvestimentItemRowProps = {
    item: ItemInvestiment;
    onEditClick: (itemId: number) => void;
    onDeleteClick: (itemId: ItemInvestiment) => void;
}

function InvestimentItemRow({ item, onEditClick, onDeleteClick} : InvestimentItemRowProps ){
    const totalValue = Number(item.quantity) * Number(item.unit_price)
    const isBuyOrder = 'COMPRA';
    return (
        <li 
            key={item.id}
            className="bg-slate-800/60 rounded-lg border border-slate-700 p-4 space-y-4">
            <div className="flex justify-between items-start">
                <div >
                    <span
                        className={`px-2 py-1 text-xs font-bold rounded-full border
                        ${
                            isBuyOrder
                            ? 'bg-green-900/50 text-green-300 border-green-500/30'
                            : 'bg-red-900/50 text-red-300 border-red-500/30'
                        }`}
                    >
                        {item.order_type === 'BUY' ? 'COMPRA': 'VENDA'}
                    </span>
                    <h4 className="font-semibold text-lg text-blue-300 mt-1">
                        {item.asset.code.toUpperCase()}
                    </h4>
                </div>
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => onEditClick(item.id)}
                        className="p-2 rounded-full hover:bg-slate-700 group"
                    >
                        <Pencil className="w-5 h-5 text-slate-400 group-hover:text-blue-400 cursor-pointer"/>
                    </button>
                    <button 
                        onClick={() => onDeleteClick(item)}
                        className="p-2 rounded-full hover:bg-slate-700 group"
                    >
                        <Trash className="w-5 h-5 text-slate-400 group-hover:text-red-500 cursor-pointer"/>
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-slate-700/50 pt-4">
                <div>
                    <p className="text-xs text-slate-400">Quantidade</p>
                    <p className="font-mono font-medium text-slate-200">
                        {Number(item.quantity).toLocaleString('pt-BR')}
                    </p>
                </div>
                <div>
                    <p className="text-xs text-slate-400">Preço Unitário</p>
                    <p className="font-mono font-medium text-slate-200">
                        R$ {Number(item.unit_price).toFixed(2)}
                    </p>
                </div>
                <div>
                    <p className="text-xs text-slate-400">Data da Operação</p>
                    <p className="font-mono font-medium text-slate-200">
                        {new Date(item.operation_date + 'T00:00:00').toLocaleDateString(
                            'pt-BR', { timeZone: 'UTC' }
                        )}
                    </p>
                </div>
                <div>
                    <p className="text-xs text-slate-400">Custo Total</p>
                    <p 
                        className={`text-xl font-bold font-mono
                        ${isBuyOrder ? 'text-red-200': 'text-green-200'}`}
                    >
                        R$ {totalValue.toFixed(2)}
                    </p>
                </div>
            </div>
        </li>
    )
}
export function InvestimentCard(
    {
        data,
        onAddInvestiment,
        onUpdateInvestiment,
        onDeleteInvestiment,
        onDeleteMonthCard,
        availableAssets,
    } : Props
) {
    const [isAdding, setIsAdding] = useState(false);
    const [editingItemId, setIsEditingItemId] = useState<number | null>(null)
    const { confirm } = useConfirmation();

    const handleSaveNewInvestiment = async (formData: InvestimentFormData) => {
        const selectedAsset = availableAssets.find(
            asset => asset.code === formData.assetCode
        )
        if (!selectedAsset){
            toast.error('Ativo selecionado é inválido, tente novamente')
            throw new Error('ativo inválido')
        }
        const NewItemData: Omit<ItemInvestiment, 'id'> = {
            asset: selectedAsset,
            order_type: formData.order_type,
            quantity: formData.quantity,
            unit_price: formData.unit_price,
            operation_date: formData.operation_date
        }
        await onAddInvestiment(data.id, NewItemData);
    }
    const handleSaveEditedInvestiment = async (formData: InvestimentFormData) => {
        if(!editingItemId) return;
        const selectedAsset = availableAssets.find(
            asset => asset.code === formData.assetCode
        );

        if(!selectedAsset){
            toast.error('Ativo selecionado é inválido, tente novamente');
            throw new Error('ativo inválido');
        }
        const updatedItemData: Omit<ItemInvestiment, 'id'> = {
            asset: selectedAsset,
            order_type: formData.order_type,
            quantity: formData.quantity,
            unit_price: formData.unit_price,
            operation_date: formData.operation_date
        }
        await onUpdateInvestiment(editingItemId, updatedItemData);
        
    }
    const handleCancelEdit = () => {
        setIsEditingItemId(null);
    }

    const handleDeleteClick = async (item: ItemInvestiment) => {
        const isConfirmed = await confirm({
            title: '[ CONFIRMA EXCLUSÃO ]',
            description: 'você realmente deseja excluir o registro de investimento?',
            confirmText: 'Sim, Excluir',
            cancelText: 'Não, Manter'
        });
        if(isConfirmed){
            try{
                await onDeleteInvestiment(item.id);
            } catch (error){
                throw new Error('erro ao apagar registro de investimento')
            }
        }
    };
    const handleDeleteMonthCard = async (card: CardInvestimentMonth) => {
        const isConfirmed = await confirm({
            title: '[ CONFIRMA EXCLUSÃO ]',
            description: `você realmente deseja excluir o mês de: ${card.month}/${card.year}`,
            confirmText: 'Sim, Excluir',
            cancelText: 'Não, Manter'
        });
        if(isConfirmed){
            try{
                await onDeleteMonthCard(card.id);
            } catch (error){
                throw new Error('erro ao apagar mês de investimentos')
            }
        }
    }
    const nameMonth = new Date(data.year, data.month - 1).toLocaleString('pt-BR', { month: 'long'})
    const totalInvested = data.itens
        .filter(item => item.order_type === 'BUY')
        .reduce((sum, item) => sum + (Number(item.quantity) * Number(item.unit_price)), 0)
    return(
        <div className="bg-slate-900 rounded-xl shadow-lg shadow-purple-900/20 border
         border-slate-700 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-800 bg-slate-800/50 flex flex-col
            sm:flex-row justify-between items-center gap-2">
                <h3 className="font-bold text-xl text-slate-200 tracking-wider">
                    <span className="text-purple-400">
                         [
                    </span>
                     {nameMonth.charAt(0).toUpperCase() + nameMonth.slice(1)} / {data.year} 
                    <span className="text-purple-400">
                        ]
                    </span>
                </h3>
                <div className="flex items-center gap-4">
                    {totalInvested > 0 && (
                        <p className="text-sm font-bold text-slate-100 rounded-full">
                            Total Aportado: R$ {totalInvested.toFixed(2)}
                        </p>
                    )}
                    <button
                        onClick={() => { setIsAdding(true)}}
                        className="bg-blue-600 hover:bg-blue-800 text-white font-semibold
                        text-xs py-2 px-3 rounded-md transition-colors duration-200"
                    >
                        + Investimento
                    </button>
                    <TooltipProvider delayDuration={200}>
                        <Tooltip>
                            <TooltipTrigger asChild>   
                                <button
                                    onClick={() => handleDeleteMonthCard(data)}
                                    aria-label="Deletar Mês"
                                >
                                    <Trash className="w-5 h-5 text-slate-400 group group-hover:text-red-500 cursor-pointer"/>
                                </button>
                            </TooltipTrigger>
                            <TooltipContent className="bg-slate-800 text-white border-slate-700">
                                <p>Deletar Mês</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>
            <div className="p-5">
                {isAdding && (
                    <AddInvestimentForm
                        onSave={handleSaveNewInvestiment}
                        onCancel={() => setIsAdding(false)}
                        submitButtonText="Adicionar Investimento"
                        availableAssets={availableAssets}
                    />
                )}
                {!isAdding && data.itens.length === 0 && (
                    <p className="text-slate-500 italic text-center py-6">
                        Nenhum Registro de Investimento associado
                    </p>
                )}
                {!isAdding && data.itens.length > 0 && (
                    <ul className="space-y-4">
                        {data.itens.map((item) => (
                            editingItemId === item.id ? (
                                <AddInvestimentForm 
                                    key={`edit-${item.id}`}
                                    initialData={item}
                                    onSave={handleSaveEditedInvestiment}
                                    onCancel={handleCancelEdit}
                                    submitButtonText="Salvar Alterações"
                                    availableAssets={availableAssets}
                                />
                            ) : (
                                <InvestimentItemRow 
                                    key={item.id}
                                    item={item}
                                    onEditClick={setIsEditingItemId}
                                    onDeleteClick={handleDeleteClick}
                                />
                            )
                        ))}
                    </ul>
                )}
                    
            </div>
        </div>
        
    )
}

        
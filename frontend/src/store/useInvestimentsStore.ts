import api from '@base/lib/api'
import { create } from 'zustand'
import { ItemInvestiment, CardInvestimentMonth, NewMonthCard } from '@base/types/investiments'
import { toast } from 'react-hot-toast'
import { InvestimentFormData } from '@base/components/investiments/AddInvestimentForm'

type DividendFilters = {
    year?: number | string;
    month?: number | string;
}

type PaginatedResponse<T> = {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}

type InvestimentsState = {
    count: number;
    cards: CardInvestimentMonth[]
    loading: boolean;
    error: null | string;
    fetchInvestiments: (filters?: DividendFilters, page?: number) => Promise<void>;
    updateInvestiments: (itemId: number, updatedItemData: Omit<ItemInvestiment, 'id'>) => Promise<void>;
    deleteInvestiments: (itemId: number) => Promise<void>;
    addInvestiments: (cardId: number, newInvestiment: Omit<ItemInvestiment, 'id'>) => Promise<void>;
    deleteMonthCard: (cardId: number) => Promise<void>;
    addMonthCard: (data: NewMonthCard) => Promise<void>
}

export const useInvestimentStore = create<InvestimentsState>((set, get) => ({
    count: 0,
    cards: [],
    loading: false,
    error: null,
    fetchInvestiments: async (filters = {}, page = 1) => {
        set({ loading: true, error: null})
        try{
            const response = await api.get<PaginatedResponse<CardInvestimentMonth>>
            ('/cards-investiments/', {
                params: { ...filters, page }
            })
            set({
                cards: response.data.results,
                count: response.data.count,
                loading: false
            })
        } catch (error){
            const errorMessage = 'não foi possivel carregar os investimentos'
            set({ error: errorMessage, loading: false})
            toast.error(errorMessage)
        }
    },
    addInvestiments: async (cardId, NewInvestiment) => {
        const dataParaApi = {
            asset_id: NewInvestiment.asset.id,
            order_type: NewInvestiment.order_type,
            quantity: NewInvestiment.quantity,
            unit_price: NewInvestiment.unit_price,
            operation_date: NewInvestiment.operation_date,
            card: cardId

        }
        const promise = api.post('/itens-investiments/', dataParaApi)
        await toast.promise(promise, {
            loading: 'Adicionando Investimento..',
            success: 'Investimento Adicionado com Sucesso',
            error: 'Falha ao Adicionar Investimento'
        });
        await get().fetchInvestiments();
    },
    updateInvestiments: async (itemId, updatedItemData) => {
        const dataToApi = {
            asset_id: updatedItemData.asset.id,
            order_type: updatedItemData.order_type,
            quantity: updatedItemData.quantity,
            unit_price: updatedItemData.unit_price,
            operation_date: updatedItemData.operation_date, 
        }
        const promise = api.patch(`/itens-investiments/${itemId}/`, dataToApi);
        await toast.promise(promise, {
            loading: 'Atualizando Registro...',
            success: 'Investimento Atualizado com Sucesso',
            error: 'Falha ao Atualizar Registro'
        });
        await get().fetchInvestiments();
    },
    addMonthCard: async (data) => {
        const { month, year} = data;
        const { cards } = get();
        const mesExiste = cards.some(card => card.month === month && card.year === year)
        if (mesExiste){
            toast.error('este mês já está registrado');
            throw new Error('mês já registrado')
        }
        const promise = api.post('/cards-investiments/', {month, year})
        await toast.promise(promise, {
            loading: 'criando registro de mês..',
            success: 'novo mês de referência adicionado',
            error: (err: any) => err.response?.data?.detail || 'erro ao adicionar registro de mês'
        })
        await get().fetchInvestiments();
    },
    deleteInvestiments: async (itemId) => {
        const promise = api.delete(`/itens-investiments/${itemId}/`);
        await toast.promise(promise, {
            loading: 'Deletando Investimento..',
            success: 'Investimento Deletado com Sucesso',
            error: 'Não foi possivel deletar o investimento'
        });
        set(state => ({
            cards: state.cards.map(card => ({
                ...card,
                itens: card.itens.filter(item => item.id !== itemId)
            }))
        }));
        await get().fetchInvestiments();
    },
    deleteMonthCard: async(cardId) => {
        const promise = api.delete(`/cards-investiments/${cardId}/`)
        await toast.promise(promise, {
            loading: 'Deletando Card de Investimento...',
            success: 'Card Deletado com Sucesso',
            error: 'Não foi possivel deletar o Card'
        });
        await get().fetchInvestiments();
    },
}))



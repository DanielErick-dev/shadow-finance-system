import api from "@base/lib/api";
import { create } from 'zustand';
import type { DividendMonth, ItemDividend } from '@base/types/dividends'
import toast from "react-hot-toast";

type newCardData = {
    month: number;
    year: number;
}
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
export type DividendsState = {
    cards: DividendMonth[];
    count: number;
    loading: boolean;
    error: string | null;
    fetchDividends: (filters?: DividendFilters, page?: number) => Promise<void>;
    addDividend: (cardId: number, newItemData: Omit<ItemDividend, 'id'>) => Promise<void>;
    updateDividend: (itemId: number, updatedItemData: Omit<ItemDividend, 'id'>) => Promise<void>;
    deleteDividend: (itemId: number) => Promise<void>;
    addMonthCard: (data: newCardData) => Promise<void>;
    deleteCard: (cardId: number) => Promise<void>;
}

export const useDividendsStore = create<DividendsState>((set, get) => ({
    cards: [],
    count: 0,
    loading: false,
    error: null,

    fetchDividends: async (filters = {}, page = 1) => {
        set({ loading: true, error: null });
        try {
            const response = await api.get<PaginatedResponse<DividendMonth>>('/cards-dividends/', {
                params: { ...filters, page }
            });

            set({ 
                cards: response.data.results,
                count: response.data.count,
                loading: false 
            });
        } catch (error) {
            const errorMessage = 'Não foi possível carregar os dados dos dividendos.';
            set({ error: errorMessage, loading: false });
            toast.error(errorMessage);
        }
    },
    addDividend: async (cardId, newItemData) => {
        const dataParaApi = {
            value: newItemData.value,
            received_date: newItemData.received_date,
            asset_id: newItemData.asset.id,
            card_month: cardId
        };
        const promise = api.post('/itens-dividends/', dataParaApi);
        await toast.promise(promise, {
            loading: 'Adicionando dividendo...',
            success: 'Dividendo adicionado com sucesso!',
            error: 'Falha ao adicionar dividendo.',
        });
        await get().fetchDividends(); 
    },

    updateDividend: async (itemId, updatedItemData) => {
        const dataParaApi = {
            value: updatedItemData.value,
            received_date: updatedItemData.received_date,
            asset_id: updatedItemData.asset.id,
        };
        const promise = api.patch(`/itens-dividends/${itemId}/`, dataParaApi);
        await toast.promise(promise, {
            loading: 'Atualizando registro...',
            success: 'Dividendo atualizado com sucesso!',
            error: 'Falha ao atualizar registro.',
        });
        await get().fetchDividends();
    },

    deleteDividend: async (itemId) => {
        const promise = api.delete(`/itens-dividends/${itemId}/`);
        await toast.promise(promise, {
            loading: 'Excluindo dividendo...',
            success: 'Dividendo excluído com sucesso.',
            error: 'Falha ao excluir dividendo.',
        });
        set(state => ({
            cards: state.cards.map(card => ({
                ...card,
                itens: card.itens.filter(item => item.id !== itemId)
            })),
            count: state.count - 1 
        }));
        await get().fetchDividends(); 
    },

    addMonthCard: async (data) => {
        const { month, year } = data;
        const { cards } = get();
        const mesExiste = cards.some(card => card.month === month && card.year === year);
        if (mesExiste) {
            toast.error('Este mês já está registrado.');
            throw new Error('Mês já registrado');
        }
        const promise = api.post('/cards-dividends/', { month, year });
        await toast.promise(promise, {
            loading: 'Criando registro do mês...',
            success: 'Novo mês de referência criado!',
            error: (err: any) => err.response?.data?.detail || 'Não foi possível criar o registro.',
        });
        await get().fetchDividends(); 
    },

    deleteCard: async (cardId) => {
        const promise = api.delete(`/cards-dividends/${cardId}/`);
        await toast.promise(promise, {
            loading: 'Excluindo mês e todos os registros...',
            success: 'Mês excluído com sucesso.',
            error: 'Falha ao excluir o mês.',
        });
        await get().fetchDividends(); 
    }
}));

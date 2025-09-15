import type { Asset } from '@base/types/assets'
import { create } from 'zustand'
import api from '@base/lib/api'
import toast from 'react-hot-toast'

export type AssetsState = {
    assets: Asset[];
    loading: boolean;
    error: null | string;
    fetchAssets: () => Promise <void>;
    addAsset: (data: Omit<Asset, 'id'>) => Promise<void>;
    updateAsset: (id: number, data: Omit<Asset, 'id'>) => Promise<void>; 
    deleteAsset: (id: number) => Promise<void>;
}

export const useAssetsStore = create<AssetsState>((set, get) => ({
    assets: [],
    loading: false,
    error: null,
    fetchAssets: async () => {
        set({ loading: true, error: null})
        try {
            const response = await api.get('/assets/')
            set({ assets: response.data, loading: false})
        } catch (error) {
            const errorMessage = 'Não foi possível carregar a lista de ativos.';
            console.error('Ocorreu um erro ao buscar ativos:', error)
            set({ error: errorMessage, loading: false})
            toast.error(errorMessage);
        }
    },

    addAsset: async (data) => {
        const promise = api.post('/assets/', data);

        await toast.promise(promise, {
            loading: 'Registrando novo ativo...',
            success: 'Ativo registrado com sucesso!',
            error: (err: any) => err.response?.data?.codigo?.[0] || 'Falha ao registrar ativo. Verifique se ele já existe',
        });

        
        await get().fetchAssets();
    },

    updateAsset: async (id, data) => {
        const promise = api.patch(`/assets/${id}/`, data);

        await toast.promise(promise, {
            loading: 'Salvando alterações...',
            success: 'Ativo atualizado com sucesso!',
            error: 'Não foi possível salvar as alterações. Verifique informações duplicadas',
        });

        await get().fetchAssets();
    },

    deleteAsset: async (id) => {
        const promise = api.delete(`/assets/${id}/`);

        await toast.promise(promise, {
            loading: 'Excluindo ativo...',
            success: 'Ativo excluído com sucesso.',
            error: 'Falha ao excluir o ativo.',
        });

        set(state => ({
            assets: state.assets.filter(asset => asset.id !== id)
        }));
    }
}));
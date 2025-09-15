import api from "@base/lib/api";
import type { Category, NewCategoryData } from "@base/types/expenses";
import { create } from "zustand";
import toast from "react-hot-toast";

export type CategoryState = {
    categories: Category[];
    error: string | null;
    loading: boolean;
    fetchCategories: () => Promise<void>;
    addCategory: (CategoryData: NewCategoryData) => Promise<void>;
    updateCategory: (categoryId: number, categoryData: NewCategoryData) => Promise<void>;
    deleteCategory: (categoryId: number) => Promise<void>;
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
    loading: false,
    error: null,
    categories: [],
    fetchCategories: async () => {
        try {
            const response = await api.get<Category[]>('/categories/');
            set({ categories: response.data });
        } catch (error) {
            const errorMessage = 'Não foi possível carregar as categorias';
            set({ error: errorMessage });
            toast.error(errorMessage);
        }
    },
    addCategory: async (categoryData) => {
        const promise = api.post('/categories/', categoryData); 
        await toast.promise(promise, {
            loading: 'Criando Nova Categoria...',
            success: 'Categoria Criada com Sucesso!',
            error: (err: any) => err.response?.data?.name?.[0] || 'Falha ao criar Categoria'
        });
        await get().fetchCategories();
    },
    updateCategory: async (categoryId, categoryData) => {
        const promise = api.patch(`/categories/${categoryId}/`, categoryData);
        await toast.promise(promise, {
            loading: 'Atualizando Categoria',
            success: 'Categoria Atualizada com Sucesso',
            error: 'Não foi possivel Atualizar a Categoria, verifique se ela já existe'
        });
        await get().fetchCategories();
    },
    deleteCategory: async (categoryId) => {
        const promise = api.delete(`/categories/${categoryId}/`);
        await toast.promise(promise, {
            loading: 'Deletando Categoria...',
            success: 'Categoria Deletada Com Sucesso!',
            error: 'Não foi possivel Deletar a Categoria, Tente Novamente'
        });
        set(state => ({
            categories: state.categories.filter(category => category.id !== categoryId)
        }))
        await get().fetchCategories();
    },
}))



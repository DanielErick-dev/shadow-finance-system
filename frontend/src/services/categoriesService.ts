import api from '@base/lib/api'
import type { Category, NewCategoryData } from '@base/types/expenses'

export const getCategories = async (): Promise<Category[]> => {
    const response = await api.get<Category[]>('/categories/')
    return response.data
}

export const createCategory = async (data: NewCategoryData): Promise<Category> => {
    const response = await api.post<Category>('/categories/', data)
    return response.data
}

export const updateCategory = async (id: number, data: NewCategoryData): Promise<Category> => {
    const response = await api.patch<Category>(`/categories/${id}/`, data)
    return response.data
}

export const deleteCategory = async (id: number): Promise<void> => {
    await api.delete(`/categories/${id}/`)
}

import api from "@base/lib/api";
import type { Asset, NewAsset } from "@base/types/assets";

export const getAssets = async (): Promise<Asset[]> => {
    const response = await api.get<Asset[]>('/assets/')
    return response.data
}

export const createAsset = async (data: NewAsset): Promise<Asset> => {
    const response = await api.post<Asset>('/assets/', data)
    return response.data
}

export const updateAsset = async (id: number, data: NewAsset): Promise<Asset> => {
    const response = await api.patch<Asset>(`/assets/${id}/`, data)
    return response.data
}

export const deleteAsset = async (id: number): Promise<void> => {
    await api.delete(`/assets/${id}/`)
}
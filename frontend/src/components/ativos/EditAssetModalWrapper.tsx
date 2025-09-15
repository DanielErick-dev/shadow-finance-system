"use client";
import { useState, useEffect } from 'react';
import GenericFormModal from '@base/components/ui/custom/GenericFormModal';
import { useAssetsStore } from '@base/store/useAssetsStore';
import { Input } from '@base/components/ui/input';
import { Label } from '@base/components/ui/label';
import type { Asset } from '@base/types/assets';

type NewAssetData = Omit<Asset, 'id'>

type EditAssetModalWrapperProps = {
    assetToEdit: Asset | null; 
    onClose: () => void;
};

export default function EditAssetModalWrapper({ assetToEdit, onClose }: EditAssetModalWrapperProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<NewAssetData>({ code: '', type: 'ACAO' });

    const { updateAsset } = useAssetsStore();

    useEffect(() => {
        if (assetToEdit) {
            setFormData({
                code: assetToEdit.code,
                type: assetToEdit.type,
            });
        }
    }, [assetToEdit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const finalValue = name === 'codigo' ? value.toUpperCase() : value;
        setFormData(prev => ({ ...prev, [name]: finalValue }));
    };

    const handleSubmit = async () => {
        if (!assetToEdit) return;

        setIsSubmitting(true);
        try {
            await updateAsset(assetToEdit.id, formData);
        } catch (error) {
            throw error;
        } finally {
            setIsSubmitting(false);
        }
    };

    const isOpen = !!assetToEdit;

    if (!isOpen) {
        return null;
    }

    return (
        <GenericFormModal
            open={isOpen}
            onOpenChange={(openState) => {
                if (!openState) {
                    onClose();
                }
            }}

            title="[ EDITAR ATIVO ]"
            description="「 Modifique os detalhes do seu ativo na carteira 」"
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
            useInternalForm={true}
            submitText="SALVAR ALTERAÇÕES"
        >
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="edit-codigo" className="text-sm font-semibold text-purple-300 tracking-wide">
                        CÓDIGO DO ATIVO
                    </Label>
                    <Input
                        id="edit-codigo"
                        name="codigo"
                        value={formData.code}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        className="bg-slate-800 border-2 border-slate-700 focus:border-purple-500 focus:ring-purple-500 text-white placeholder-slate-500 uppercase"
                        autoComplete="off"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="edit-type" className="text-sm font-semibold text-purple-300 tracking-wide">
                        TIPO
                    </Label>
                    <select
                        id="edit-tipo"
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        disabled={isSubmitting}
                        className="block w-full bg-slate-800 border-2 border-slate-700 focus:border-purple-500 focus:ring-purple-500 text-white rounded-md shadow-sm p-2.5"
                    >
                        <option value="ACAO">Ação</option>
                        <option value="FII">Fundo Imobiliário</option>
                        <option value="BDR">BDR</option>
                        <option value="ETF">ETF</option>
                    </select>
                </div>
            </div>
        </GenericFormModal>
    );
}

"use client"

import { useState, useEffect } from "react"
import GenericFormModal from "@base/components/ui/custom/GenericFormModal"
import { useCategoryStore } from "@base/store/useCategoryStore"
import { Input } from "../ui/input"
import { Label } from "@radix-ui/react-label"
import type { NewCategoryData, Category } from "@base/types/expenses"

type EditCategoryModalWrapperProps = {
    categoryToEdit: Category | null;
    onClose: () => void;
}

export default function EditCategoryModalWrapper({ categoryToEdit, onClose} : EditCategoryModalWrapperProps){
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const [formData, setFormData] = useState<NewCategoryData>({
        name: ''
    })
    const { updateCategory } = useCategoryStore();

    useEffect(() => {
        if(categoryToEdit){
            setFormData({
                name: categoryToEdit.name
            });
        }
    }, [categoryToEdit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value} = e.target
        setFormData(prev => ({ ...prev, [name]: value.toUpperCase()}));
    }
    const handleSubmit = async () => {
        if(!categoryToEdit) return;
        setIsSubmitting(true);
        try{
            await updateCategory(categoryToEdit.id, formData)
        } catch (error){
            throw error;
        } finally{
            setIsSubmitting(false);
        }
    }
    const isOpen = !!categoryToEdit;
    if(!isOpen){
        return null;
    }
    return(
        <GenericFormModal
            open={isOpen}
            onOpenChange={(openState) => {
                if(!openState){
                    onClose();
                }
            }}
            title="[ EDITAR CATEGORIA ]"
            description="[ Modifique sua Categoria ]"
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
            useInternalForm={true}
            submitText="SALVAR ALTERAÇÕES"
        >
            <div className="space-y-4">
                <Label htmlFor="name" className="text-sm font-semibold text-purple-300 tracking-wide">
                    NOME DA CATEGORIA
                </Label>
                <Input 
                    id="name"
                    name="name"
                    value={formData.name}
                    disabled={isSubmitting}
                    onChange={handleChange}
                    className="bg-slate-800 border-2 border-slate-700 focus:border-purple-500 focus:ring-purple-500 text-white placeholder-slate-500 uppercase"
                    autoComplete="off"
                />
            </div>
        </GenericFormModal>
    )
}
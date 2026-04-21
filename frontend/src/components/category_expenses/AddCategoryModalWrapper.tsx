"use client"
import { useState } from "react";
import type { NewCategoryData } from "@base/types/expenses";
import GenericFormModal from "@base/components/ui/custom/GenericFormModal";
import { Input } from "@base/components/ui/input";
import { Label } from "@base/components/ui/label";
import { useCategories } from "@base/hooks/useCategories";

export default function AddCategoryModalWrapper() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<NewCategoryData>({ name: '' })
    const { addCategory } = useCategories();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ name: e.target.value.toLowerCase() })
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            await addCategory.mutateAsync(formData);
            setFormData({ name: '' })
        } catch {
            // erro já tratado no hook
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <GenericFormModal
            title="ADICIONAR NOVA CATEGORIA"
            description="Registre uma nova categoria"
            isSubmitting={isSubmitting}
            submitText="REGISTRAR CATEGORIA"
            useInternalForm={true}
            onSubmit={handleSubmit}
            triggerButton={
                <button
                    type="button"
                    className="bg-gradient-to-r from-purple-700 to-purple-600 border border-purple-900/20 rounded-md font-semibold text-white shadow-sm hover:from-purple-600 hover:to-purple-500 hover:shadow-purple-500/30 duration-300 active:scale-95 transition-all px-4 py-2 w-full sm:w-auto cursor-pointer"
                >
                    ADICIONAR CATEGORIA
                </button>
            }
        >
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-semibold text-purple-300 tracking-wide">
                        CATEGORIA DA DESPESA
                    </Label>
                    <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Cartão de crédito"
                        disabled={isSubmitting}
                        autoComplete="off"
                        className="bg-slate-800 border-2 border-slate-700 focus:border-purple-500 focus:ring-purple-500 text-white placeholder-slate-500"
                    />
                </div>
            </div>
        </GenericFormModal>
    )
}

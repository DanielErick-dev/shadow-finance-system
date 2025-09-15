"use client"

import { useState, useEffect } from "react";
import GenericFormModal from "@base/components/ui/custom/GenericFormModal";
import AddExpenseForm from "@base/components/single_expenses/AddExpenseForm";
import { useExpensesStore } from "@base/store/useSingleExpensesStore";
import type { Expense, Category, ExpenseFormData } from "@base/types/expenses";
import { useCategoryStore } from "@base/store/useCategoryStore";

type EditExpenseModalWrapperProps = {
    expenseToEdit: Expense | null;
    onClose: () => void;
    onSuccess: () => Promise<void>;
};

export default function EditExpenseModalWrapper({
    expenseToEdit,
    onClose,
    onSuccess
}: EditExpenseModalWrapperProps){
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { updateExpense } = useExpensesStore();
    const { categories } = useCategoryStore();
    const handleSubmit = async (formData: ExpenseFormData) => {
        if(!expenseToEdit) return;
        setIsSubmitting(true);
        try{
            await updateExpense(expenseToEdit.id, formData);
        } catch(error){
            throw error;
        } finally{
            setIsSubmitting(false);
        }
        await onSuccess();
    };

    const isOpen = !!expenseToEdit;

    if(!isOpen)return null;
    return(
        <GenericFormModal
            open={isOpen}
            onOpenChange={(openState) => { if (!openState) onClose();}}
            title="[ EDITAR DESPESA ]"
            description="[ Modifique os detalhes da sua despesa ]"
            isSubmitting={isSubmitting}
            showFooter={false}
            useInternalForm={false}
        >
            <AddExpenseForm
                initialData={expenseToEdit}
                onSave={handleSubmit}
                onCancel={onClose}
                availableCategories={categories}
                submitButtonText="Salvar Alterações"
            />
        </GenericFormModal>
    )
}
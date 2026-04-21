"use client"
import { useState } from "react";
import GenericFormModal from "@base/components/ui/custom/GenericFormModal";
import AddExpenseForm from "@base/components/single_expenses/AddExpenseForm";
import { useExpenses } from "@base/hooks/useExpenses";
import { useCategories } from "@base/hooks/useCategories";
import type { Expense, ExpenseFormData } from "@base/types/expenses";

type EditExpenseModalWrapperProps = {
    expenseToEdit: Expense | null;
    onClose: () => void;
};

export default function EditExpenseModalWrapper({ expenseToEdit, onClose }: EditExpenseModalWrapperProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { editExpense } = useExpenses()
    const { categories } = useCategories()

    const handleSubmit = async (formData: ExpenseFormData) => {
        if (!expenseToEdit) return;
        setIsSubmitting(true);
        try {
            await editExpense.mutateAsync({ id: expenseToEdit.id, data: formData });
            onClose();
        } catch {
            // erro já tratado no hook
        } finally {
            setIsSubmitting(false);
        }
    };

    const isOpen = !!expenseToEdit;
    if (!isOpen) return null;

    return (
        <GenericFormModal
            open={isOpen}
            onOpenChange={(openState) => { if (!openState) onClose(); }}
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

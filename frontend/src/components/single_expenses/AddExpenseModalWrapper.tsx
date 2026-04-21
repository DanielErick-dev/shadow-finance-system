"use client"
import { useState, type ReactNode } from "react";
import GenericFormModal from "@base/components/ui/custom/GenericFormModal";
import AddExpenseForm from "@base/components/single_expenses/AddExpenseForm";
import { Layers, Repeat, FilePlus } from "lucide-react";
import { useExpenses } from "@base/hooks/useExpenses";
import { useCategories } from "@base/hooks/useCategories";
import AddRecurringExpenseForm from "../recurring_expenses/AddRecurringExpenseForm";
import AddInstallmentExpenseForm from "../installments_expenses/AddInstallmentExpenseForm";

type ModalStep = 'selection' | 'single_expense' | 'recurring' | 'installment'

type SelectionButtonProps = {
    icon: ReactNode;
    title: string;
    description: string;
    onClick: () => void;
}

function SelectionButton({ icon, title, description, onClick }: SelectionButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="w-full text-left p-4 rounded-lg border-2 border-slate-700 hover:border-purple-500/50 bg-slate-800/50 hover:bg-slate-800 transition-all duration-200"
        >
            <div className="flex items-center gap-4">
                <div className="text-purple-400">{icon}</div>
                <div>
                    <h3 className="font-semibold text-slate-200">{title}</h3>
                    <p className="text-sm text-slate-400">{description}</p>
                </div>
            </div>
        </button>
    )
}

export default function AddExpenseModalWrapper() {
    const [step, setStep] = useState<ModalStep>('selection');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [modalOpen, setModalOpen] = useState(false)

    const { addExpense } = useExpenses()
    const { categories } = useCategories()

    const handleBack = () => setStep('selection');
    const handleClose = () => { setModalOpen(false); setStep('selection'); }

    const handleSingleExpenseSubmit = async (formData: any) => {
        setIsSubmitting(true);
        try {
            await addExpense.mutateAsync(formData);
            handleClose();
        } catch {
            // erro já tratado no hook
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStepContent = () => {
        switch (step) {
            case 'single_expense':
                return (
                    <AddExpenseForm
                        onSave={handleSingleExpenseSubmit}
                        onCancel={handleBack}
                        availableCategories={categories}
                        submitButtonText="Registrar Despesa"
                        onRequestClose={handleClose}
                    />
                );
            case 'recurring':
                return <AddRecurringExpenseForm onCancel={handleBack} onSuccess={handleClose} />;
            case 'installment':
                return <AddInstallmentExpenseForm onCancel={handleBack} onSaveSuccess={handleClose} />;
            default:
                return (
                    <div className="space-y-4">
                        <SelectionButton
                            icon={<FilePlus />}
                            title='Despesa Única'
                            description="Para gastos pontuais, como um café ou uma conta"
                            onClick={() => setStep('single_expense')}
                        />
                        <SelectionButton
                            icon={<Layers />}
                            title='Compra Parcelada'
                            description="Registre uma compra e o sistema criará as parcelas"
                            onClick={() => setStep('installment')}
                        />
                        <SelectionButton
                            icon={<Repeat />}
                            title='Despesa Recorrente'
                            description="Para assinaturas e contratos como Netflix, aluguel"
                            onClick={() => setStep('recurring')}
                        />
                    </div>
                )
        }
    };

    const getTitle = () => {
        switch (step) {
            case 'single_expense': return '[ REGISTRAR DESPESA ]';
            case 'recurring': return '[ REGISTRAR DESPESA RECORRENTE ]';
            case 'installment': return '[ REGISTRAR DESPESA PARCELADA ]';
            default: return '[ SELECIONE O TIPO DE DESPESA ]'
        }
    }

    const getDescription = () => {
        switch (step) {
            case 'single_expense': return '[ Preencha os detalhes do seu gasto ]';
            case 'recurring': return '[ Preencha os detalhes da sua despesa recorrente ]';
            case 'installment': return '[ Preencha os detalhes da sua despesa parcelada ]';
            default: return "[ Qual tipo de despesa você deseja registrar? ]"
        }
    };

    return (
        <GenericFormModal
            title={getTitle()}
            open={modalOpen}
            onOpenChange={(open) => { setModalOpen(open); if (!open) setStep('selection'); }}
            description={getDescription()}
            useInternalForm={false}
            showFooter={false}
            isSubmitting={isSubmitting}
            triggerButton={
                <button className="bg-gradient-to-r from-purple-700 to-purple-600 rounded-md text-white font-semibold hover:from-purple-600 hover:to-purple-500 shadow-sm hover:shadow-purple-500/30 duration-200 active:scale-95 transition-all px-4 py-2 w-full sm:w-auto">
                    NOVA DESPESA
                </button>
            }
        >
            {renderStepContent()}
        </GenericFormModal>
    );
}

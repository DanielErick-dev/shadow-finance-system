"use client"
import { useState, type ReactNode } from "react";
import GenericFormModal from "@base/components/ui/custom/GenericFormModal";
import AddExpenseForm from "@base/components/single_expenses/AddExpenseForm";
import { ExpenseFormData } from "@base/types/expenses";
import { useExpensesStore } from "@base/store/useSingleExpensesStore";
import { Layers, Repeat, FilePlus } from "lucide-react";
import { useCategoryStore } from "@base/store/useCategoryStore";
import AddRecurringExpenseForm from "../recurring_expenses/AddRecurringExpenseForm";
import AddInstallmentExpenseForm from "../installments_expenses/AddInstallmentExpenseForm";
type ModalStep = 'selection' | 'single_expense' | 'recurring' | 'installment'

type SelectionButtonProps = {
    icon: ReactNode;
    title: string;
    description: string;
    onClick: () => void;
    disabled?: boolean;
}

function SelectionButton({
    icon,
    title,
    description,
    onClick,
    disabled = false
}: SelectionButtonProps){
    return(
        <button 
            type="button"
            disabled={disabled}
            onClick={onClick}
            className="w-full text-left p-4 rounded-lg border-2 transition-all duration-200"
        >
            <div className="flex items-center gap-4">
                <div>
                    {icon}
                </div>
                <div>
                    <h3></h3>
                    <p>{description}</p>
                </div>
            </div>
        </button>
    )
}

export default function AddExpenseModalWrapper({onSuccess} : {onSuccess: () => Promise<void>}){
    const [step, setStep] = useState<ModalStep>('selection');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [modalOpen, setModalOpen] = useState(false)
    const { addExpense } = useExpensesStore();
    const { categories } = useCategoryStore();
    const handleBack = () => setStep('selection');

    const handleSingleExpenseSubmit = async (formData: ExpenseFormData) => {
        setIsSubmitting(true);
        try{
            await addExpense(formData);
            setModalOpen(false);
        } catch (error){
            throw error;
        } finally{
            setIsSubmitting(false);
        };
        await onSuccess()
    };

    const renderStepContent = () => {
        switch (step){
            case 'single_expense':
                return(
                    <AddExpenseForm
                        onSave={handleSingleExpenseSubmit}
                        onCancel={handleBack}
                        availableCategories={categories}
                        submitButtonText="Registrar Despesa"
                        onRequestClose={() => setModalOpen(false)}
                    />
                );
            case 'recurring':
                return(
                    <AddRecurringExpenseForm onCancel={handleBack} onSuccess={onSuccess}/>
                );
            case 'installment':
                return(
                    <AddInstallmentExpenseForm onCancel={handleBack} onSaveSuccess={onSuccess}/>
                );
            case 'selection':
                default:
                    return(
                        <div className="space-y-4">
                            <SelectionButton 
                                icon={<FilePlus/>}
                                title='Despesa Única'
                                description="Para Gastos Pontuais, como um café ou uma conta"
                                onClick={() => setStep('single_expense')}
                            />
                            <SelectionButton 
                                icon={<Layers/>}
                                title='Compra Parcelada'
                                description="Registre uma Compra e o sistema criará as parcelas"
                                onClick={() => setStep('installment')}
                            />
                            <SelectionButton 
                                icon={<Repeat/>}
                                title='Despesa Recorrente'
                                description="Para assinaturas e contratos como: Nextlix, Aluguel"
                                onClick={() => setStep('recurring')}
                            />

                        </div>
                    )
        };
    };
    
    const getTitle = () => {
        switch(step){
            case 'single_expense': return '[ REGISTRAR DESPESA ]';
            case 'recurring': return '[ REGISTRAR DESPESA RECORRENTE ]'
            case 'installment': return '[ REGISTRAR DESPESA PARCELADA ]'
            default: return '[ SELECIONE O TIPO DE DESPESA ]'
        }
    }

    const getDescription = () => {
        switch(step){
            case 'single_expense': return '[ Preencha os Detalhes do seu Gasto ]';
            case 'recurring': return '[ Preencha os Detalhes da sua Despesa Recorrente ]';
            case 'installment': return '[ Preencha os Detalhes da sua Despesa Parcelada ]'
            default: return "[ qual tipo de despesa você deseja registrar? ]"
        }
    };

    return(
        <GenericFormModal
            title={getTitle()}
            open={modalOpen}
            onOpenChange={setModalOpen}
            description={getDescription()}
            useInternalForm={false}
            showFooter={false}
            isSubmitting={isSubmitting}
            triggerButton={
                <button
                    className="bg-gradient-to-r from-purple-700 to-purple-600 rounded-md text-white font-semibold hover:from-purple-600 hover:to-purple-500 shadow-sm  hover:shadow-purple-500/30 duration-200 active:scale-95 transition-all px-4 py-2 w-full sm:w-auto"
                >
                    NOVA DESPESA
                </button>
            }
        > 
            {renderStepContent()}       
        </GenericFormModal>
    );
}
"use client";

import { createContext, useContext, useState, type ReactNode, useCallback } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@base/components/ui/alert-dialog";

type ConfirmationOptions = {
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
}

type ConfirmationContextType = {
    confirm: (options: ConfirmationOptions) => Promise<boolean>;
}

const ConfirmationDialogContext = createContext<ConfirmationContextType | undefined>(undefined);

export function ConfirmationDialogProvider({ children }: { children: ReactNode }) {
    const [options, setOptions] = useState<ConfirmationOptions | null>(null);
    const [resolvePromise, setResolvePromise] = useState<{ resolve: (value: boolean) => void } | null>(null);
    const confirm = useCallback((options: ConfirmationOptions): Promise<boolean> => {
        return new Promise((resolve) => {
            setOptions(options);
            setResolvePromise({ resolve });
        });
    }, []); 

    const handleDismiss = () => {
        resolvePromise?.resolve(false);
        setOptions(null);
        setResolvePromise(null); 
    };

    const handleConfirm = () => {
        resolvePromise?.resolve(true);
        setOptions(null);
        setResolvePromise(null); 
    };

    return (
        <ConfirmationDialogContext.Provider value={{ confirm }}>
            {children}
            <AlertDialog open={!!options} onOpenChange={(isOpen) => {
                if (!isOpen) {
                    handleDismiss();
                }
            }}>
                <AlertDialogContent className='bg-slate-900 border-2 border-purple-800/50 rounded-xl shadow-lg shadow-purple-500/20 text-slate-200 sm:max-w-md'>
                    <AlertDialogHeader className="text-center border-b border-purple-800/30 pb-4">
                        <AlertDialogTitle className='text-2xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400'>
                            {options?.title}
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-400 pt-2">
                            {options?.description}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className='border-t border-purple-800/30 pt-4 mt-4'>
                        <AlertDialogCancel
                            onClick={handleDismiss}
                            className='bg-slate-700 text-slate-300 hover:bg-slate-600 border-slate-600 focus:ring-slate-500'
                        >
                            {options?.cancelText || 'Cancelar'}
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirm}
                            className='bg-gradient-to-r from-red-600 to-red-800 text-white hover:from-red-700 hover:to-red-900 focus:ring-red-500'
                        >
                            {options?.confirmText || 'Confirmar'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </ConfirmationDialogContext.Provider>
    )
}

// O seu hook customizado `useConfirmation` está perfeito e não precisa de mudanças.
export const useConfirmation = () => {
    const context = useContext(ConfirmationDialogContext);
    if (context === undefined) {
        throw new Error('useConfirmation must be used within a ConfirmationDialogProvider');
    }
    return context;
};

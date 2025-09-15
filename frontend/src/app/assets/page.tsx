"use client";
import { useEffect, useState } from "react";
import { useAssetsStore } from "@base/store/useAssetsStore";
import { useConfirmation } from "@base/contexts/ConfirmationDialogContext";
import AddAssetModalWrapper from "@base/components/ativos/AddAssetModalWrapper";
import EditAssetModalWrapper from "@base/components/ativos/EditAssetModalWrapper";
import BackButton from "@base/components/ui/custom/backButton";
import type { Asset } from "@base/types/assets";
import { Pencil, Trash2, Wallet } from 'lucide-react';

export default function AtivosPage() {
    const { assets, loading, error, fetchAssets, deleteAsset } = useAssetsStore();
    const { confirm } = useConfirmation();
    const [assetToEdit, setAssetToEdit] = useState<Asset | null>(null);

    useEffect(() => {
        fetchAssets();
    }, [fetchAssets]);

    const handleDeleteClick = async (asset: Asset) => {
        const isConfirmed = await confirm({
            title: "[ CONFIRMAR EXCLUSÃO ]",
            description: `Deseja realmente excluir o ativo ${asset.code.toUpperCase()} da sua carteira? Esta ação é irreversível.`,
            confirmText: "Sim, Excluir Ativo",
        });

        if (isConfirmed) {
            await deleteAsset(asset.id);
        }
    };

    if (loading) {
        return <div className="flex h-screen items-center justify-center text-lg text-purple-400 animate-pulse">「 Carregando carteira de ativos... 」</div>;
    }
    if (error) {
        return <div className="flex h-screen items-center justify-center text-red-400">[ ERRO DE CONEXÃO: {error} ]</div>;
    }

    return (
        <>
            <div className="min-h-screen text-slate-200 py-6 sm:py-10">
                <div className="container mx-auto px-4 md:px-6 max-w-4xl">
                    
                    <div className="mb-10">
                        <BackButton />
                    </div>

                    <header className="flex flex-col sm:flex-row justify-between items-center mb-10 pb-5 border-b border-purple-800/50">
                        <h1 className="text-4xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-4 sm:mb-0">
                            [ GESTÃO DE ATIVOS ]
                        </h1>
                        <AddAssetModalWrapper />
                    </header>
                    <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-lg shadow-purple-900/20 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="border-b border-slate-700 bg-slate-800/50">
                                <tr>
                                    <th className="p-4 text-sm font-semibold text-purple-300 tracking-wider">CÓDIGO DO ATIVO</th>
                                    <th className="p-4 text-sm font-semibold text-purple-300 tracking-wider">TIPO</th>
                                    <th className="p-4 text-sm font-semibold text-purple-300 tracking-wider text-right">AÇÕES</th>
                                </tr>
                            </thead>
                            <tbody>
                                {assets.map(asset => (
                                    <tr key={asset.id} className="border-b border-slate-800 last:border-b-0 hover:bg-slate-800/70 transition-colors">
                                        <td className="p-4 font-medium text-blue-300">{asset.code}</td>
                                        <td className="p-4 text-slate-400">{asset.type}</td>
                                        <td className="p-4">
                                            <div className="flex justify-end items-center gap-3">
                                                <button onClick={() => setAssetToEdit(asset)} className="p-2 rounded-full hover:bg-slate-700 group" aria-label="Editar Ativo">
                                                    <Pencil className="w-4 h-4 text-slate-400 group-hover:text-blue-400 transition-colors" />
                                                </button>
                                                <button onClick={() => handleDeleteClick(asset)} className="p-2 rounded-full hover:bg-slate-700 group" aria-label="Excluir Ativo">
                                                    <Trash2 className="w-4 h-4 text-slate-400 group-hover:text-red-500 transition-colors" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {assets.length === 0 && (
                            <div className="text-center text-slate-500 p-8 flex flex-col items-center gap-4">
                                <Wallet className="w-16 h-16 text-slate-700" />
                                <p>Nenhum ativo cadastrado. Clique no botão de adicionar para começar.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <EditAssetModalWrapper
                assetToEdit={assetToEdit}
                onClose={() => setAssetToEdit(null)}
            />
        </>
    );
}


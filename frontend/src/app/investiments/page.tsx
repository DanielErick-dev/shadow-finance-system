"use client"

import { useState } from "react"

import { useInvestments } from "@base/hooks/useInvestiments"
import { useAssets } from "@base/hooks/useAssets"

import { Skeleton } from "@base/components/ui/custom/Skeleton"
import ErrorComponent from "@base/components/ui/custom/ErrorComponent"
import BackButton from "@base/components/ui/custom/backButton"
import GenericFormModal from "@base/components/ui/custom/GenericFormModal"
import ReusablePagination from "@base/components/ui/custom/ReusablePagination"
import { Label } from "@base/components/ui/label"
import { InvestimentCard } from "@base/components/investiments/listInvestiment"

export default function Investiments(){
    const [isSubmittingMonth, setIsSubmittingMonth] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itensPerPage = 3;
    const [newMonthData, setNewMonthData] = useState({
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
    });
    const [filters, setFilters] = useState({ year: '', month: '' })

    const {
        count,
        cards,
        isLoading,
        isError,
        addInvestmentItem,
        editInvestmentItem,
        removeInvestmentItem,
        addMonthCard,
        removeMonthCard,
    } = useInvestments(filters, currentPage)

    const { assets } = useAssets()

    const handlePageChange = (page: number) => setCurrentPage(page)
    const totalPages = Math.ceil(count / itensPerPage)

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    }

    const clearFilters = () => setFilters({ year: '', month: '' })

    const handleAddMonthSubmit = async () => {
        setIsSubmittingMonth(true);
        try {
            await addMonthCard.mutateAsync(newMonthData);
        } catch {
            // erro já tratado no hook com toast
        } finally {
            setIsSubmittingMonth(false);
        }
    }

    const handleNewMonthChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target
        setNewMonthData((prev) => ({ ...prev, [name]: Number(value) }));
    }

    const availableYears = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i)
    const monthsOfYear = Array.from({ length: 12 }, (_, i) => ({
        value: i + 1,
        name: new Date(0, i).toLocaleString('pt-BR', { month: 'long' })
    }))

    if (isLoading) return (
        <div className="min-h-screen text-slate-200 py-6 sm:py-10">
            <div className="container mx-auto px-4 md:px-6 max-w-4xl">
                <header className="flex justify-between items-center mb-10 pb-5 border-b border-purple-800/50">
                    <Skeleton className="h-10 w-72" />
                    <Skeleton className="h-9 w-32 rounded-lg" />
                </header>
                <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden">
                            <div className="p-4 border-b border-slate-700 flex justify-between">
                                <Skeleton className="h-6 w-32" />
                                <Skeleton className="h-6 w-20" />
                            </div>
                            <div className="p-4 space-y-3">
                                {Array.from({ length: 3 }).map((_, j) => (
                                    <div key={j} className="flex justify-between items-center">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-4 w-16" />
                                        <Skeleton className="h-4 w-20" />
                                        <Skeleton className="h-4 w-20" />
                                        <Skeleton className="h-7 w-16 rounded-full" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
    if (isError) return <ErrorComponent error="Erro de conexão" errorMessage="NÃO FOI POSSÍVEL CARREGAR OS INVESTIMENTOS" />

    return(
        <div className="min-h-screen text-slate-200 py-6 sm:py-10">
            <div className="container mx-auto px-4 md:px-6 max-w-4xl">
                <header className="flex flex-col sm:flex-row justify-between items-center mb-10 pb-5 border-b border-purple-800/50 gap-3">
                    <h1 className="text-4xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                        REGISTRO DE INVESTIMENTOS
                    </h1>
                    <div className="mb-4 sm:mb-0">
                        <BackButton/>
                    </div>
                    <GenericFormModal
                        title="[ADICIONAR MÊS DE REFERÊNCIA]"
                        description="[selecione o mês e ano para criar um novo registro de investimentos]"
                        isSubmitting={isSubmittingMonth}
                        onSubmit={handleAddMonthSubmit}
                        submitText="CRIAR REGISTRO"
                        useInternalForm={true}
                        triggerButton={
                            <button className="flex items-center bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold px-4 py-2 cursor-pointer rounded-lg hover:from-purple-500 hover:to-blue-500 transition-colors shadow-lg duration-200">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                                </svg>
                                NOVO MÊS DE REFERÊNCIA
                            </button>
                        }
                    >
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="month" className="text-sm font-semibold text-purple-300 tracking-wide">Mês</Label>
                                <select name="month" id="month" value={newMonthData.month} onChange={handleNewMonthChange}
                                    className="p-2 block w-full bg-slate-800 border-2 border-slate-700 focus:border-purple-500 focus:ring-purple-500 rounded-md"
                                >
                                    {monthsOfYear.map((month) => (
                                        <option key={month.value} value={month.value}>
                                            {month.name.charAt(0).toUpperCase() + month.name.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="year" className="text-sm font-semibold text-purple-300 tracking-wide">Ano</Label>
                                <input name="year" id="year" type="number" value={newMonthData.year} onChange={handleNewMonthChange}
                                    className="p-2 block w-full bg-slate-800 border-2 border-slate-700 rounded-md focus:border-purple-500 focus:ring-purple-500"
                                    min={2000} max={new Date().getFullYear() + 10}
                                />
                            </div>
                        </div>
                    </GenericFormModal>
                </header>

                <div className="p-4 mb-8 bg-slate-800/50 border border-slate-700 rounded-lg flex flex-col gap-4 md:flex-row md:items-center">
                    <h3 className="text-sm font-semibold text-slate-300 whitespace-nowrap">FILTRAR POR:</h3>
                    <div className="w-full md:w-auto">
                        <select name="year" value={filters.year} onChange={handleFilterChange}
                            className="w-full bg-slate-900 border border-slate-600 rounded-md p-2 text-white focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                        >
                            <option value="">Todos os Anos</option>
                            {availableYears.map(year => <option key={year} value={year}>{year}</option>)}
                        </select>
                    </div>
                    <div className="w-full md:w-auto">
                        <select name="month" value={filters.month} onChange={handleFilterChange}
                            className="w-full bg-slate-900 border border-slate-600 rounded-md p-2 text-white focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                        >
                            <option value="">Todos os Meses</option>
                            {monthsOfYear.map(month => (
                                <option key={month.value} value={month.value}>
                                    {month.name.charAt(0).toUpperCase() + month.name.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button onClick={clearFilters}
                        className="w-full md:w-auto md:ml-auto bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm font-semibold py-2 px-4 rounded-md transition-colors cursor-pointer"
                    >
                        Limpar Filtros
                    </button>
                </div>

                {cards.length === 0 && (
                    <div className="text-center py-16 bg-slate-900 border rounded-xl border-dashed border-slate-700">
                        <h3 className="mt-4 text-lg font-medium text-slate-300">Nenhum Registro Encontrado</h3>
                        <p className="mt-1 text-sm text-slate-500">Inicie adicionando um novo mês de referência para seus investimentos</p>
                    </div>
                )}

                <div className="space-y-10">
                    {cards.map((card) => (
                        <InvestimentCard
                            key={card.id}
                            data={card}
                            onAddInvestiment={(data) => addInvestmentItem.mutateAsync(data)}
                            onUpdateInvestiment={(itemId, data) => editInvestmentItem.mutateAsync({ itemId, data })}
                            onDeleteInvestiment={(itemId) => removeInvestmentItem.mutateAsync(itemId)}
                            onDeleteMonthCard={(cardId) => removeMonthCard.mutateAsync(cardId)}
                            availableAssets={assets}
                        />
                    ))}
                </div>
            </div>
            <div className="mt-10">
                <ReusablePagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </div>
        </div>
    )
}

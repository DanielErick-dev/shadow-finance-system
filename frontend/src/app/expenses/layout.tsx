"use client";

import { type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, Repeat, Layers, Tags, ArrowLeft } from 'lucide-react';

const sidebarNavItems = [
    {
        title: "Lançamentos do Mês",
        href: "/expenses",
        icon: <LayoutGrid className="h-4 w-4" />,
    },
    {
        title: "Despesas Recorrentes",
        href: "/expenses/recurring",
        icon: <Repeat className="h-4 w-4" />,
    },
    {
        title: "Compras Parceladas",
        href: "/expenses/installments",
        icon: <Layers className="h-4 w-4" />,
    },
    {
        title: "Categorias",
        href: "/expenses/categories",
        icon: <Tags className="h-4 w-4" />,
    },
    {
        title: "Voltar Pro Painel",
        href: "/painel",
        icon: <ArrowLeft className="h-4 w-4" />,
    }
];

export default function ExpensesLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 md:grid md:grid-cols-[250px_1fr]">
            <aside className="hidden md:flex md:flex-col p-3 border-r border-slate-800">
                <h2 className="text-lg font-semibold text-purple-300 tracking-wider mb-6">
                    PAINEL DE DESPESAS
                </h2>
                <nav className="flex flex-col gap-2">
                    {sidebarNavItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-slate-300 transition-all hover:bg-slate-800 hover:text-purple-300
                                ${pathname === item.href ? 'bg-slate-800 text-purple-400 font-semibold' : ''}
                            `}
                        >
                            {item.icon}
                            {item.title}
                        </Link>
                    ))}
                </nav>
            </aside>

            <main className="py-6 sm:py-10">
                <div className="md:hidden mb-6 px-4">
                    <select
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-white focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                        value={pathname}
                        onChange={(e) => window.location.href = e.target.value}
                    >
                        {sidebarNavItems.map((item) => (
                            <option key={item.href} value={item.href}>
                                {item.title}
                            </option>
                        ))}
                    </select>
                </div>
                
                <div className="container mx-auto px-2 md:px-6 max-w-7xl">
                    {children}
                </div>
            </main>
        </div>
    );
}

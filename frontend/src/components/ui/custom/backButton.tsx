"use client";
import { useRouter } from 'next/navigation';
import { ArrowLeftCircle } from 'lucide-react';

export default function BackButton() {
    const router = useRouter();

    const handleGoToPanel = () => {
        router.push('/painel');
    };

    return (
        <button
            onClick={handleGoToPanel}
            className="group flex items-center gap-2 px-4 py-2 bg-slate-800/50 border border-purple-800/30 rounded-lg 
                       text-slate-300 font-semibold text-sm transition-all duration-300
                       hover:border-purple-600/70 hover:bg-slate-800 hover:shadow-lg hover:shadow-purple-500/10"
        >
            <ArrowLeftCircle 
                className="w-5 h-5 text-purple-400 transition-transform duration-300 
                           group-hover:-translate-x-1" 
            />
            Retornar ao Painel
        </button>
    );
}

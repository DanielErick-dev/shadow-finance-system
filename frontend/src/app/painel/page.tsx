"use client";
import { useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Landmark,        
  TrendingUp,      
  Wallet,          
  Receipt,         
  ChevronRight     
} from 'lucide-react';
import { type ReactNode } from 'react';

const painelItems = [
  {
    title: "DASHBOARD",
    description: "Visualize um resumo completo e estatísticas da sua jornada financeira.",
    icon: <LayoutDashboard className="h-8 w-8 text-purple-400" />,
    path: "/dashboard" 
  },
  {
    title: "REGISTRO DE DIVIDENDOS",
    description: "Gerencie os proventos recebidos de seus ativos e acompanhe sua renda passiva.",
    icon: <Landmark className="h-8 w-8 text-blue-400" />,
    path: "/dividends"
  },
  {
    title: "GESTÃO DE ATIVOS",
    description: "Cadastre e organize todos os ativos que compõem sua carteira de investimentos.",
    icon: <Wallet className="h-8 w-8 text-green-400" />,
    path: "/assets" 
  },
  {
    title: "CONTROLE DE DESPESAS",
    description: "Acompanhe seus gastos, categorize suas saídas e mantenha o orçamento em dia.",
    icon: <Receipt className="h-8 w-8 text-red-400" />,
    path: "/expenses"
  },
  {
    title: "EVOLUÇÃO DE INVESTIMENTOS",
    description: "Acompanhe a performance e o crescimento do seu portfólio ao longo do tempo.",
    icon: <TrendingUp className="h-8 w-8 text-cyan-400" />,
    path: "/investiments"
  }
];

type PainelCardProps = {
    item: {
        title: string;
        description: string;
        icon: ReactNode;
        path: string;
    };
    onClick: (path: string) => void;
}

function PainelCard({ item, onClick }: PainelCardProps) {
    return (
            <button
                onClick={() => onClick(item.path)}
                className="group relative w-full h-full text-left p-6 bg-slate-900 border-2 border-slate-800 rounded-xl 
                hover:border-purple-600/80 hover:-translate-y-1 transition-all duration-300 ease-in-out
                focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-950"
            >
                <div className="flex items-center gap-4">
                    <div className="p-2 bg-slate-800 border border-slate-700 rounded-lg">
                        {item.icon}
                    </div>
                    <h2 className="text-lg font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                        [ {item.title} ]
                    </h2>
                </div>
                <p className="mt-4 text-sm text-slate-400">
                    {item.description}
                </p>
                <div className="absolute bottom-4 right-4 text-slate-600 group-hover:text-purple-400 transition-colors duration-300">
                    <ChevronRight className="h-6 w-6" />
                </div>
            </button>
    );
}


export default function PainelPage() {
    const router = useRouter();

    const handleNavigation = (path: string) => {
        router.push(path);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 to-black text-slate-200 flex items-center justify-center p-4 sm:p-6">
            <div className="w-full max-w-6xl">
                <header className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold tracking-wider text-slate-100">
                        PAINEL DE CONTROLE
                    </h1>
                    <p className="mt-2 text-lg text-purple-400/80 capitalize">
                        「 Selecione uma opção 」
                    </p>
                    <div className="h-px w-32 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent mx-auto mt-4"></div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {painelItems.map((item) => (
                        <PainelCard 
                            key={item.title}
                            item={item}
                            onClick={handleNavigation}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
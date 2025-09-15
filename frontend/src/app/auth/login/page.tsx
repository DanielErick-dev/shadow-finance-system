"use client";
import { useState} from 'react';
import { useAuth } from '@base/contexts/AuthContext';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { login } = useAuth();
    
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setError(null);
        setIsSubmitting(true);
        try {
            
            await login(username, password);
        } catch (error) {
            setError('Acesso negado! Credenciais inválidas.');
            setIsSubmitting(false);
        }
    };
    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4 font-mono">
            <div className="absolute inset-0 overflow-hidden opacity-20">
                {[...Array(20)].map((_, i) => (
                    <div 
                        key={i}
                        className="absolute bg-purple-500 rounded-full"
                        style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            width: `${Math.random() * 10 + 2}px`,
                            height: `${Math.random() * 10 + 2}px`,
                            animation: `float ${Math.random() * 10 + 5}s infinite ease-in-out`
                        }}
                    />
                ))}
            </div>
            <div className="relative bg-gray-900/80 backdrop-blur-sm border border-purple-500/30 rounded-xl shadow-lg shadow-purple-500/10 w-full max-w-md overflow-hidden z-10">
                <div className="bg-gradient-to-r from-purple-900/50 to-black p-6 border-b border-purple-500/20">
                    <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 text-center tracking-wider">
                        [ HUNTER LOGIN SYSTEM ]
                    </h1>
                    <p className="text-xs text-gray-500 text-center mt-1">
                        「 Acesso restrito a usuários autorizados 」
                    </p>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {error && (
                        <div className="bg-red-900/50 border border-red-700/50 p-3 rounded-lg flex items-center">
                            <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-red-400 text-sm">{error}</span>
                        </div>
                    )}
                    <div className="space-y-2">
                        <label className="text-sm text-purple-400 font-medium">USUÁRIO</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                name="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Digite seu ID de caçador"
                                className="w-full bg-gray-800 border border-gray-700 focus:border-purple-500 rounded-lg p-3 pl-10 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-900 transition-all"
                                required
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm text-purple-400 font-medium">SENHA</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <input
                                type="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full bg-gray-800 border border-gray-700 focus:border-purple-500 rounded-lg p-3 pl-10 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-900 transition-all"
                                required
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:shadow-purple-500/20 transition-all duration-300 flex items-center justify-center"
                        disabled={isSubmitting}
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        </svg>
                        { isSubmitting ? 'CONECTANDO...': 'ACESSAR SISTEMA'}
                    </button>
                </form>
                <div className="bg-black/50 p-4 border-t border-purple-500/10 text-center">
                    <p className="text-xs text-gray-600">
                        Sistema v1.0 | © {new Date().getFullYear()} - [ SHADOW MONARCH AUTHENTICATION ]
                    </p>
                </div>
            </div>

            <style jsx>{`
                @keyframes float {
                    0% { transform: translateY(0) translateX(0); opacity: 1; }
                    100% { transform: translateY(-100vh) translateX(20px); opacity: 0; }
                }
            `}</style>
        </div>
    );
}
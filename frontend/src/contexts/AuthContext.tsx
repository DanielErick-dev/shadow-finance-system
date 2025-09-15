"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import api from '@base/lib/api';
import toast from 'react-hot-toast';
import { audioService } from '@base/lib/audio';

type User = {
    id: number;
    username: string;
    email: string;
}

type AuthContextType = {
    isAuthenticated: boolean;
    loading: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    user: User | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    const verifyUser = async () => {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            setLoading(false);
            return;
        }

        try {
            const response = await api.get('/me/');
            setUser(response.data);
        } catch (error) {
            console.error("Falha na verificação de autenticação:", error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        verifyUser();
    }, []);

    const login = async (username: string, password: string) => {
        const loadingToastId = toast.loading('Autenticando...');
        try {
            const response = await api.post('/token/', { username, password });
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            await verifyUser();
            toast.success('Login bem-sucedido!', { id: loadingToastId });
            audioService.play('ergase', 0.8)
            router.push('/painel');
        } catch (error) {
            console.error("Erro no login:", error);
            toast.error('Credenciais inválidas. Tente novamente.', { id: loadingToastId });
            throw new Error('Falha no login');
        }
    }

    const logout = () => {
        toast.success('Deslogado com sucesso.');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setUser(null);
        if (pathname !== '/auth/login') {
            router.push('/auth/login');
        }
    }
    
    const value = {
        user,
        isAuthenticated: !!user,
        loading,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth deve ser usado dentro de um AuthProvider');
    }
    return context;
}

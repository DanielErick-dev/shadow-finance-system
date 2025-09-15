"use client"

import { useEffect, type ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@base/contexts/AuthContext';

type PrivateRouteProps = {
    children: ReactNode;
};

const publicRoutes = ['/auth/login'];
export default function PrivateRoute({ children }: PrivateRouteProps) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    const isPublicRoute = publicRoutes.includes(pathname);
    useEffect(() => {
        if(loading){
            return;
        }
        if(isPublicRoute){
            return;
        }
        if(!user){
            router.push('/auth/login');
        }
    }, [user, loading, router, pathname, isPublicRoute])
    if (loading){
        return(
            <div className="flex h-screen items-center justify-center bg-slate-950">
                <p className="text-lg text-purple-400 animate-pulse">
                    [ Verificando Autenticação... ]
                </p>
            </div>
        )
    }
    if (isPublicRoute || user){
        return children;
    }
    return null;
}
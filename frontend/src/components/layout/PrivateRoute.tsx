"use client"

import { useEffect, type ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@base/contexts/AuthContext';
import LoadingComponent from '@base/components/ui/custom/LoadingComponent';

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
        if(loading || isPublicRoute) return;
        if(!user) router.push('/auth/login');
        
    }, [user, loading, router, pathname, isPublicRoute])

    if (loading){
        return <LoadingComponent text="VERIFICANDO AUTENTICAÇÃO"/>
    }

    if (isPublicRoute || user)return children;
    return null;
}

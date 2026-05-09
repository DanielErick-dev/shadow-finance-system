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
        if (loading) return; 

        if (user && isPublicRoute) {
            router.push('/painel');
        }
        if (!user && !isPublicRoute) {
            router.push('/auth/login');
        }
    }, [user, loading, isPublicRoute, router]);

    if (loading) {
        return <LoadingComponent text="VERIFICANDO AUTENTICAÇÃO" />;
    }

    if ((user && isPublicRoute) || (!user && !isPublicRoute)) {
        return null;
    }

    return children;
}

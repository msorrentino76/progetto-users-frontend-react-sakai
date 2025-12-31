// app/(main)/admin/layout.tsx
'use client';
import { useAuth } from '@/layout/context/authcontext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function RoleGuard({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // Eseguiamo il controllo SOLO quando il caricamento è finito
        if (!loading) {
            if (!user || !user.roles.includes('backoffice')) {
                router.replace('/auth/access');
            }
        }
    }, [user, loading, router]); // Si attiva ogni volta che questi valori cambiano

    // 1. Se sta caricando, mostriamo uno stato vuoto o uno spinner
    if (loading) return <></>;

    // 2. Se non è backoffice, non renderizziamo i children per evitare il "flicker"
    // (mentre il router prepara il redirect)
    if (!user || !user.roles.includes('backoffice')) {
        return null;
    }

    // 3. Se tutto è ok, mostriamo il contenuto
    return <>{children}</>;
};
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/layout/context/authcontext';
import { ProgressSpinner } from 'primereact/progressspinner';

export default function RootPage() {

    const { user, loading } = useAuth();

    const router = useRouter();

    useEffect(() => {

        // 1. Se il context sta ancora caricando i dati dell'utente, non fare nulla
        if (loading) return;

        // 2. Se non c'è un utente loggato, rimanda al login
        if (!user) {
            router.replace('/auth/login');
            return;
        }

        // 3. Logica di smistamento (Il vero Dispatcher)
        if (user.roles.includes('admin')) {
            router.replace('/admin/dashboard');
        } 
        
        if (user.roles.includes('backoffice')) {
            router.replace('/backoffice/dashboard');
        }
        
    }, [user, loading, router]);

    // Mentre il router reindirizza, mostriamo uno spinner di PrimeReact 
    // per dare un senso di caricamento professionale
    return (
        <div className="flex align-items-center justify-content-center" style={{ height: '80vh' }}>
            <div className="text-center">
                <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" />
                <p className="mt-3">Caricamento della tua area di lavoro...</p>
            </div>
        </div>
    );
}
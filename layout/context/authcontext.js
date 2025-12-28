'use client';

import React, { createContext, useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService'; // <--- Importiamo il servizio

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    /**
     * Inizializzazione: al caricamento dell'app (o al refresh F5)
     * verifichiamo se esiste una sessione valida su Laravel.
     */
    useEffect(() => {
        const checkUser = async () => {
            try {
                // Usiamo il metodo centralizzato del servizio
                const res = await authService.getUser();
                setUser(res.data);
            } catch (err) {
                // Se la sessione è scaduta o non esiste, resettiamo l'utente
                setUser(null);
            } finally {
                // In ogni caso, il caricamento iniziale è terminato
                setLoading(false);
            }
        };

        checkUser();
    }, []);

    /**
     * Funzione di Logout centralizzata
     */
    const logout = async () => {
        try {
            await authService.logout();
            setUser(null);
            router.push('/auth/login');
        } catch (err) {
            console.error("Errore durante il logout:", err);
            // Anche se la chiamata fallisce lato server, puliamo il lato client
            setUser(null);
            router.push('/auth/login');
        }
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            setUser, 
            loading, 
            logout, 
            isAuthenticated: !!user 
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth deve essere utilizzato all\'interno di un AuthProvider');
    }
    return context;
};
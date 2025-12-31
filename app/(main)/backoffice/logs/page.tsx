'use client';

import React from 'react';

/**
 * Componente Funzionale UsersPage
 * Rappresenta la pagina di gestione utenti nell'area admin.
 */
const UsersPage = () => {
    
    // Qui potrai inserire la logica (es. fetch dei dati da Laravel)
    
    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">

                    <h5>Log di sistema</h5>

                    <p className="pb-4 text-600">
                        Visualizza e gestisci i log di sistema.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default UsersPage;
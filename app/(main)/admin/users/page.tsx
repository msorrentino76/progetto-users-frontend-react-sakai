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

                    <h6 className="font-semibold m-0">Gestione Utenti</h6>

                    <p className="m-0 mt-2 text-600">
                        Visualizza e gestisci i permessi degli utenti del sistema.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default UsersPage;
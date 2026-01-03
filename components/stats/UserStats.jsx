'use client';
import React, { useEffect, useState } from "react";
import { Skeleton } from 'primereact/skeleton';
import { Badge } from 'primereact/badge';
import { statsService } from '@/services/stats/statsService';
import { _role } from '@/constants/roles'; // Importazione delle costanti

const UserStats = ({ hiddenBackoffice = false }) => {
    const [loading, setLoading] = useState(true);
    const [roles, setRoles] = useState([]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await statsService.getStatsUsersByRole();
                // Filtro dinamico basato sulla prop
                const data = hiddenBackoffice 
                    ? response.data.filter(r => r.role !== 'backoffice') 
                    : response.data;
                setRoles(data);
            } catch (error) {
                console.error('Errore nel recupero statistiche:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [hiddenBackoffice]);

    return (
        <div className="card mb-0 shadow-2 border-round p-3">
            <div className="flex justify-content-between align-items-center mb-4">
                <div>
                    <span className="block text-600 font-bold mb-1">Distribuzione Utenti</span>
                    <div className="text-400 text-sm">Suddivisione per ruolo</div>
                </div>
                <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                    <i className="pi pi-users text-blue-500 text-xl" />
                </div>
            </div>

            <div className="flex flex-column gap-3">
                {loading ? (
                    // Skeleton loader ripetuto per simulare la lista
                    [1, 2, 3].map((n) => (
                        <div key={n} className="flex justify-content-between align-items-center">
                            <Skeleton width="40%" height="1.2rem" />
                            <Skeleton width="20%" height="1.2rem" />
                        </div>
                    ))
                ) : roles.length > 0 ? (
                    roles.map((item, index) => {
                        // Uso della funzione helper dal tuo file constants/roles.js
                        const config = _role(item.role);
                        
                        return (
                            <div key={index} className="flex align-items-center justify-content-between p-2 border-round hover:surface-100 transition-duration-200">
                                <div className="flex align-items-center gap-2">
                                    <i className={`${config.icon} text-${config.severity === 'danger' ? 'red' : config.severity}-500`} />
                                    <span className="font-medium text-700">{config.label}</span>
                                </div>
                                <Badge value={item.count} severity={config.severity} size="large" />
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center text-500 py-3">Nessun dato disponibile</div>
                )}
            </div>
        </div>
    );
};

export default UserStats;
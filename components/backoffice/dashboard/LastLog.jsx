'use client';
import React, {useEffect, useState} from "react";

import { Skeleton } from 'primereact/skeleton';

import { logService } from '@/services/backoffice/logService';

const LastLog = () => {

  const [loading, setLoading] = useState(true);

  const [text, setText] = useState('');
    
    useEffect(() => {
        const fetchLogs = async () => { 
            try {
                const response = await logService.getLogs();
                setText(response.data[0]?.filename.replace('laravel-', '') || 'Nessun log');
            } catch (error) {
                console.error('Errore nel recupero dei log:', error);
                setText('Errore!');
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, []);

  return (
    <div className="card mb-0">
        <div className="flex justify-content-between mb-3">
            <div>
                <span className="block text-500 font-medium mb-3">Ultimo Log:</span>
                    {loading ? (
                        <Skeleton width="120px" height="1.5rem" /> 
                    ) : (
                        <div className="text-500 font-medium text-xl">{text}</div>
                    )}
            </div>
            <div className="flex align-items-center justify-content-center bg-red-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                <i className="pi pi-exclamation-circle text-red-500 text-xl" />
            </div>
        </div>
    </div>
  );
}; 

export default LastLog;
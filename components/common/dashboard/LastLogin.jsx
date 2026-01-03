'use client';
import React from "react";

import { useAuth } from '@/layout/context/authcontext';
import {formatDate} from '@/lib/utils';

const LastLogin = () => {

  const { user } = useAuth();

  return (
    <div className="card mb-0">
        <div className="flex justify-content-between mb-3">
            <div>
                <span className="block text-500 font-medium mb-3">Accesso precedente:</span>
                {/* Se non c'è last_login, mostriamo un messaggio alternativo 
                <div className={user?.last_login ? "text-500 font-medium text-xl" : "text-500 font-medium"}>{user?.last_login ? formatDate(user.last_login) : "Questo è il primo accesso registrato"}</div>
                */}
                <div className="text-500 font-medium text-xl">{user?.last_login ? formatDate(user.last_login) : "-"}</div>
            </div>
            <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                <i className="pi pi-user text-blue-500 text-xl" />
            </div>
        </div>
        {/* Avviso di sicurezza se l'ultimo accesso è registrato
        {user?.last_login && <span className="text-red-500 font-medium">Se non riconosci questo accesso, contatta l'amministratore</span>}
        */}  
    </div>
  );
}; 

export default LastLogin;
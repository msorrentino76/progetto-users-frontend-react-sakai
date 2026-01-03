import React from "react";
import { Badge } from 'primereact/badge';
import { Tag } from 'primereact/tag'; // Componente ideale per i ruoli
import { Divider } from 'primereact/divider';
import { formatDate } from '@/lib/utils';
import { _role } from '@/constants/roles';

const Details = ({ user }) => {

    return (
        <div className="text-center p-4 surface-50 border-round-top">
            {/* Avatar Circle */}
            <div className="inline-flex align-items-center justify-content-center border-circle bg-primary-100 text-primary-900 mb-3" style={{ width: '64px', height: '64px' }}>
                <span className="text-2xl font-bold">{user.name[0]}{user.surname[0]}</span>
            </div>

            {/* Nome e Titolo */}
            <div className="text-2xl font-semibold text-900">{user.title} {user.name} {user.surname}</div>
            
            {/* Badge di Stato Generale */}
            <Badge value={user.disabled ? 'Disabilitato' : 'Attivo'} severity={user.disabled ? 'danger' : 'success'} className="mt-2" />

            <Divider />

            {/* Info Contatto e Accesso */}
            <div className="text-600 font-medium mb-2">
                <i className="pi pi-envelope mr-2 text-sm"></i>
                <a href={`mailto:${user.email}`} className="font-medium no-underline text-primary">
                    {user.email}
                </a>
            </div>
            <div className="text-600 font-medium mb-3">
                <span className="text-sm">Ultimo accesso: </span>
                <span className="text-900">
                    {user.last_login ? formatDate(user.last_login) : <u className="text-400">Nessun accesso</u>}
                </span>
            </div>

            <Divider align="center">
                <span className="p-tag p-tag-secondary p-tag-rounded font-normal text-xs uppercase px-2">Ruoli assegnati</span>
            </Divider>

            {/* Visualizzazione Pretty dei Ruoli */}
            <div className="flex flex-wrap justify-content-center gap-2 mt-3">
                {user.roles && user.roles.map((r, index) => {
                    const roleConfig = _role(r);
                    return (
                        <Tag 
                            key={index}
                            severity={roleConfig.severity} 
                            value={roleConfig.label} 
                            icon={roleConfig.icon}
                            rounded
                            style={{ padding: '0.5rem 1rem' }}
                        />
                    );
                })}
            </div>
        </div>
    )
};

export default Details;
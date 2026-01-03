import React from "react";
import { Badge } from 'primereact/badge';
import { Tag } from 'primereact/tag';
import { Divider } from 'primereact/divider';
import { formatDate } from '@/lib/utils';
import { _role } from '@/constants/roles';

const Details = ({ user }) => {
    if (!user) return null;

    return (
        <div className="text-center p-4 surface-50 border-round-top">
            {/* Avatar Section */}
            <div className="flex justify-content-center mb-3">
                <div className="inline-flex align-items-center justify-content-center border-circle bg-primary-100 text-primary-900" style={{ width: '64px', height: '64px' }}>
                    <span className="text-2xl font-bold">{user.name[0]}{user.surname[0]}</span>
                </div>
            </div>

            {/* Name and Title */}
            <div className="text-2xl font-semibold text-900 mb-2">
                {user.title} {user.name} {user.surname}
            </div>
            
            <Badge value={user.disabled ? 'Disabilitato' : 'Attivo'} severity={user.disabled ? 'danger' : 'success'} />

            <Divider />

            {/* Info Grid - Usiamo div e span correttamente */}
            <div className="flex flex-column gap-2 text-600">
                <div className="flex align-items-center justify-content-center">
                    <i className="pi pi-envelope mr-2 text-sm"></i>
                    <span className="font-medium">Email:</span>
                    <a href={`mailto:${user.email}`} className="font-bold no-underline ml-2 text-primary">
                        {user.email}
                    </a>
                </div>

                <div className="flex align-items-center justify-content-center">
                    <i className="pi pi-calendar mr-2 text-sm"></i>
                    <span className="font-medium mr-2">Ultimo accesso:</span>
                    <span className="text-900">
                        {user.last_login ? formatDate(user.last_login) : <span className="text-400 font-italic">Nessun accesso effettuato</span>}
                    </span>
                </div>
            </div>

            <Divider align="center">
                <span className="text-xs uppercase text-500 font-semibold px-2">Ruoli</span>
            </Divider>

            {/* Roles Section */}
            <div className="flex flex-wrap justify-content-center gap-2">
                {user.roles && user.roles.map((r, index) => {
                    const roleConfig = _role(r);
                    return (
                        <Tag 
                            key={index}
                            severity={roleConfig.severity} 
                            value={roleConfig.label} 
                            icon={roleConfig.icon}
                            rounded
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default Details;
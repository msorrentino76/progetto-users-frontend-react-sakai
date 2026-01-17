/* eslint-disable @next/next/no-img-element */
'use client';
import React, { useEffect, useState } from 'react';
import AppMenuitem from './AppMenuitem';
import { MenuProvider } from './context/menucontext';
import { AppMenuItem } from '@/types';

import { useAuth } from '@/layout/context/authcontext';

const AppMenu = () => {

    const { user, loading } = useAuth();

    const isAdmin      = user?.roles.includes('admin');
    const isBackoffice = user?.roles.includes('backoffice');

    const [menuItems, setMenuItems] = useState<AppMenuItem[]>([]);

    useEffect(() => {
        let newMenuItems: AppMenuItem[] = [];
        if (loading) return;
        if (isAdmin)      { newMenuItems = [...newMenuItems, ...modelMenuAdmin     ]; } // Mergio i menù per i multi ruoli
        if (isBackoffice) { newMenuItems = [...newMenuItems, ...modelMenuBackoffice]; } // Mergio i menù per i multi ruoli
        //else { setMenuItems([]); }
        setMenuItems(newMenuItems);
    }, [user, loading]);

    const modelMenuAdmin: AppMenuItem[] = [

        {
            label: 'Menù Amministratore',
            items: [
                { label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/admin/dashboard' },
                { label: 'Utenti'   , icon: 'pi pi-fw pi-users', to: '/admin/users' },
            ]
        },

    ];

    const modelMenuBackoffice: AppMenuItem[] = [

        {
            label: 'Menù Backoffice',
            items: [
                { label: 'Dashboard', icon: 'pi pi-fw pi-home'  , to: '/backoffice/dashboard' },
                { label: 'Utenti'   , icon: 'pi pi-fw pi-users' , to: '/backoffice/users' },
                { label: 'Test PDF' , icon: 'pi pi-fw pi-users' , to: '/backoffice/pdfgenexample' },
                { label: 'Logs'     , icon: 'pi pi-fw pi-align-left', to: '/backoffice/logs' },
            ]
        },

    ];
    
    return (
        <MenuProvider>
            <ul className="layout-menu">
                {menuItems.map((item, i) => {
                    return !item?.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
                })}
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;

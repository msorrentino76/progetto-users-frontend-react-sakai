/* eslint-disable @next/next/no-img-element */
'use client';
import React, { useEffect, useState } from 'react';
import AppMenuitem from './AppMenuitem';
import { MenuProvider } from './context/menucontext';
import { AppMenuItem } from '@/types';

import { useAuth } from '@/layout/context/authcontext';

const AppMenu = () => {

    const { user, loading } = useAuth();

    const isAdmin = user?.roles.includes('admin');
    const isBackoffice = user?.roles.includes('backoffice');

    const [menuItems, setMenuItems] = useState<AppMenuItem[]>([]);

    useEffect(() => {
        if (loading) return;
        if (isAdmin) { setMenuItems(modelMenuAdmin); }
        if (isBackoffice) { setMenuItems(modelMenuBackoffice); }
        //else { setMenuItems([]); }
    }, [user, loading]);

    const modelMenuAdmin: AppMenuItem[] = [

        {
            label: 'Home',
            items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' }]
        },
        {
            label: 'Gestione Utenti',
            items: [
                { label: 'Utenti', icon: 'pi pi-fw pi-users', to: '/admin/users' },
            ],
        },
    ];

    const modelMenuBackoffice: AppMenuItem[] = [

        {
            label: 'Home',
            items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' }]
        },
        {
            label: 'Manteinance',
            items: [
                { label: 'Logs', icon: 'pi pi-fw pi-users', to: '/backoffice/logs' },
            ],
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

/* eslint-disable @next/next/no-img-element */

import Link from 'next/link';
import { classNames } from 'primereact/utils';
import React, { forwardRef, useContext, useImperativeHandle, useRef } from 'react';
import { AppTopbarRef } from '@/types';
import { LayoutContext } from './context/layoutcontext';

import { useAuth } from './context/authcontext';
import { confirmDialog, ConfirmDialog } from 'primereact/confirmdialog';

import ProfileSidebar from './components/ProfileSidebar';

const AppTopbar = forwardRef<AppTopbarRef>((props, ref) => {
    const { layoutConfig, layoutState, onMenuToggle, showProfileSidebar } = useContext(LayoutContext);
    const menubuttonRef = useRef(null);
    const topbarmenuRef = useRef(null);
    const topbarmenubuttonRef = useRef(null);

    const { logout } = useAuth();

    useImperativeHandle(ref, () => ({
        menubutton: menubuttonRef.current,
        topbarmenu: topbarmenuRef.current,
        topbarmenubutton: topbarmenubuttonRef.current
    }));

    const [profileVisible, setProfileVisible] = React.useState(false);

    const confirmLogout = () => {
        confirmDialog({
            message: 'Sei sicuro di voler chiudere questa sessione di lavoro?',
            header: 'Conferma Logout',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sì',
            rejectLabel: 'No',
            // Eseguiamo il logout direttamente
            accept: () => logout(), 
        });
    };

    return (
        <div className="layout-topbar">
            <Link href="/" className="layout-topbar-logo">
                <img src={`/layout/images/logo-${layoutConfig.colorScheme !== 'light' ? 'white' : 'dark'}.svg`} width="47.22px" height={'35px'} alt="logo" />
                <span>SAKAI</span>
            </Link>

            <button ref={menubuttonRef} type="button" className="p-link layout-menu-button layout-topbar-button" onClick={onMenuToggle}>
                <i className="pi pi-bars" />
            </button>

            <button ref={topbarmenubuttonRef} type="button" className="p-link layout-topbar-menu-button layout-topbar-button" onClick={showProfileSidebar}>
                <i className="pi pi-ellipsis-v" />
            </button>

            <div ref={topbarmenuRef} className={classNames('layout-topbar-menu', { 'layout-topbar-menu-mobile-active': layoutState.profileSidebarVisible })}>
                
                {/* Altri bottoni del topbar 
                <button type="button" className="p-link layout-topbar-button">
                    <i className="pi pi-calendar"></i>
                    <span>Calendar</span>
                </button>
                */}

                <button type="button" className="p-link layout-topbar-button" onClick={() => setProfileVisible(true)}>
                    <i className="pi pi-user"></i>
                    <span>Profile</span>
                </button>
                
                <button type="button" className="p-link layout-topbar-button" onClick={confirmLogout}>
                    <i className="pi pi-sign-out"></i>
                    <span>Logout</span>
                </button>

            </div>

            <ProfileSidebar 
                visible={profileVisible} 
                onHide={() => setProfileVisible(false)} 
            />

            <ConfirmDialog />

        </div>
    );
});

AppTopbar.displayName = 'AppTopbar';

export default AppTopbar;

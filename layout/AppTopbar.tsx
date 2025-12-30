/* eslint-disable @next/next/no-img-element */

import Link from 'next/link';
import { classNames } from 'primereact/utils';
import React, { forwardRef, useContext, useImperativeHandle, useRef } from 'react';
import { AppTopbarRef } from '@/types';
import { LayoutContext } from './context/layoutcontext';

import { authService } from '@/services/authService'; 
import { useAuth } from '@/layout/context/authcontext';

import { confirmDialog, ConfirmDialog } from 'primereact/confirmdialog';
import { Badge } from 'primereact/badge';
import ProfileSidebar from './components/ProfileSidebar';

import { Toast } from 'primereact/toast';

const AppTopbar = forwardRef<AppTopbarRef>((props, ref) => {
    const { layoutConfig, layoutState, onMenuToggle, showProfileSidebar } = useContext(LayoutContext);
    const menubuttonRef = useRef(null);
    const topbarmenuRef = useRef(null);
    const topbarmenubuttonRef = useRef(null);

    const { logout, user, refreshUserInfo } = useAuth();

    useImperativeHandle(ref, () => ({
        menubutton: menubuttonRef.current,
        topbarmenu: topbarmenuRef.current,
        topbarmenubutton: topbarmenubuttonRef.current
    }));

    const [profileVisible, setProfileVisible] = React.useState(false);
    const [errors, setErrors] = React.useState({});
    const [loadingUserProfile, setLoadingUserProfile] = React.useState(false);
    const [loadingPassword, setLoadingPassword] = React.useState(false);

    const toast = useRef(null);

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

    const handleUserSubmit = async (e, userData) => {
        e.preventDefault();
        setLoadingUserProfile(true);
        setErrors({}); // Resetta gli errori ad ogni tentativo
        try {
            const resp = await authService.putUserProfile(userData);
            setProfileVisible(false);
            refreshUserInfo(Date.now());
            toast.current.show({severity:'success', summary: 'Successo', detail: 'Dati salvati correttamente', life: 3000});
        } catch (error) {
            if (error.response && error.response.status === 422) {
                setErrors(error.response.data.errors);
            } else {
                console.error('Errore generico:', error);
                toast.current.show({severity:'error', summary: 'Errore', detail: 'Errore generico', life: 3000});
            }
        } finally {
            setLoadingUserProfile(false);
        }
    };

    const handlePasswordSubmit = async (e, passwords) => {
        e.preventDefault();
        setLoadingPassword(true);
        setErrors({}); // Resetta gli errori ad ogni tentativo
        try {
            const resp = await authService.putUserPassword(passwords);
            setProfileVisible(false);
            refreshUserInfo(Date.now());
            toast.current.show({severity:'success', summary: 'Successo', detail: 'Password aggiornata correttamente', life: 3000});
        } catch (error) {
            if (error.response && error.response.status === 422) {
                setErrors(error.response.data.errors);
            } else {
                console.error('Errore generico:', error);
                toast.current.show({severity:'error', summary: 'Errore', detail: 'Errore generico', life: 3000});
            }
        } finally {
            setLoadingPassword(false);
        }
    };

    return (
        <>
            <style>
                {`
                    .layout-topbar-button span {
                        font-size: 1rem !important;
                        display: block !important;
                    }
                `}
            </style>

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
                        <i className="pi pi-user p-overlay-badge">
                            {!user.changed_first_pwd && <Badge value="!" severity="danger"></Badge>}
                        </i>
                    </button>
                    
                    <button type="button" className="p-link layout-topbar-button" onClick={confirmLogout}>
                        <i className="pi pi-sign-out"></i>
                    </button>

                </div>

                <ProfileSidebar 
                    visible={profileVisible} 
                    handleUserSubmit={handleUserSubmit}
                    handlePasswordSubmit={handlePasswordSubmit}
                    onHide={() => setProfileVisible(false)} 
                    loadingUserProfile={loadingUserProfile}
                    loadingPassword={loadingPassword}
                    errors={errors}
                />

                <ConfirmDialog />

                <Toast ref={toast} />

            </div>

        </>

    );
});

AppTopbar.displayName = 'AppTopbar';

export default AppTopbar;

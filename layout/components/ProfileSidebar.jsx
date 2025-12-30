// layout/components/ProfileSidebar.js
import React, { useEffect, useState } from 'react';
import { Sidebar } from 'primereact/sidebar';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { Message } from 'primereact/message';
import { classNames } from 'primereact/utils';

import { BlockUI } from 'primereact/blockui';
import { ProgressSpinner } from 'primereact/progressspinner';

import { useAuth } from '../context/authcontext';

const ProfileSidebar = ({ visible,  handleUserSubmit, handlePasswordSubmit, onHide, loadingUserProfile, loadingPassword, errors }) => {

    const { user } = useAuth();

    // Stati per i form (puoi separarli o unirli)
    const [userData, setUserData]   = useState({ name: user.name, surname: user.surname, email: user.email, title: user.title });
    const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });

    useEffect(() => {
        // Aggiorna i dati dell'utente quando il sidebar viene aperto
        if (visible) { 
            setUserData({ name: user.name, surname: user.surname, email: user.email, title: user.title });
            setPasswords({ current: '', new: '', confirm: '' });
        }   
    }, [visible, user]);
    
    return (
        <Sidebar visible={visible} onHide={onHide} position="right" style={{ width: '34rem' }}>

            {!user.changed_first_pwd && <><Message severity="warn" text="Si consiglia di modificare la password per la prima volta." /><br/><br/></>}  

            <div className="p-fluid">

                <BlockUI blocked={loadingUserProfile} template={<ProgressSpinner />}>
                    {/* Form Dati Anagrafici */}
                    <form onSubmit={(e) => handleUserSubmit(e, userData)}>
                        <h5>Informazioni Account</h5>
                        <div className="field mt-3">
                            <label htmlFor="title" className="font-bold">Titolo</label>
                            <InputText id="title" value={userData.title} className={classNames('', { 'p-invalid': errors.title })} onChange={(e) => setUserData({...userData, title: e.target.value})} />
                            {/* Mostra il primo messaggio di errore se esiste */}
                            {errors.title && <small className="p-error block mt-1">{errors.title[0]}</small>}
                        </div>
                        <div className="field mt-3">
                            <label htmlFor="name" className="font-bold">Nome</label>
                            <InputText id="name" value={userData.name} className={classNames('', { 'p-invalid': errors.name })} onChange={(e) => setUserData({...userData, name: e.target.value})} />
                            {/* Mostra il primo messaggio di errore se esiste */}
                            {errors.name && <small className="p-error block mt-1">{errors.name[0]}</small>}
                        </div>
                        <div className="field mt-3">
                            <label htmlFor="surname" className="font-bold">Cognome</label>
                            <InputText id="surname" value={userData.surname} className={classNames('', { 'p-invalid': errors.surname })} onChange={(e) => setUserData({...userData, surname: e.target.value})} />
                            {/* Mostra il primo messaggio di errore se esiste */}
                            {errors.surname && <small className="p-error block mt-1">{errors.surname[0]}</small>}
                        </div>
                        <div className="field mt-3">
                            <label htmlFor="email" className="font-bold">Email <i>(usata per accedere e riceve notifiche)</i></label>
                            <InputText id="email" value={userData.email} className={classNames('', { 'p-invalid': errors.email })} onChange={(e) => setUserData({...userData, email: e.target.value})} />
                            {/* Mostra il primo messaggio di errore se esiste */}
                            {errors.email && <small className="p-error block mt-1">{errors.email[0]}</small>}
                        </div>
                        <Button type="submit" label="Salva Modifiche" icon="pi pi-check" className="p-button-sm" />
                    </form>
                </BlockUI>

                <Divider />

                <BlockUI blocked={loadingPassword} template={<ProgressSpinner />}>
                    {/* Form Sicurezza */}
                    <form onSubmit={(e) => handlePasswordSubmit(e, passwords)}>
                        <h5>Sicurezza</h5>
                        <div className="field mt-3">
                            <label htmlFor="current_password">Password Attuale</label>
                            <Password
                                autoComplete="new-password"
                                value={passwords.current}
                                onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                                toggleMask feedback={false}
                                inputClassName={classNames('', { 'p-invalid': errors.current })}
                            />
                            {/* Mostra il primo messaggio di errore se esiste */}
                            {errors.current && <small className="p-error block mt-1">{errors.current[0]}</small>}
                        </div>
                        <div className="field mt-3">
                            <label htmlFor="new_password">Nuova Password</label>
                            <Password
                                autoComplete="new-password"
                                value={passwords.new}
                                onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                                toggleMask feedback={true}
                                inputClassName={classNames('', { 'p-invalid': errors.new })}
                            />
                            {/* Mostra il primo messaggio di errore se esiste */}
                            {errors.new && <small className="p-error block mt-1">{errors.new[0]}</small>}
                        </div>
                        <div className="field mt-3">
                            <label htmlFor="confirm_password">Conferma Password</label>
                            <Password
                                autoComplete="new-password"
                                value={passwords.confirm}
                                onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                                toggleMask feedback={false}
                                inputClassName={classNames('', { 'p-invalid': errors.confirm })}
                            />
                            {/* Mostra il primo messaggio di errore se esiste */}
                            {errors.confirm && <small className="p-error block mt-1">{errors.confirm[0]}</small>}
                        </div>
                        <Button type="submit" label="Aggiorna Password" icon="pi pi-lock" className="p-button-warning p-button-sm" />
                    </form>
                </BlockUI>

            </div>

        </Sidebar>
    );
};

export default ProfileSidebar;
// layout/components/ProfileSidebar.js
import React, { useState } from 'react';
import { Sidebar } from 'primereact/sidebar';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';

import { useAuth } from '../context/authcontext';

const ProfileSidebar = ({ visible, onHide }) => {

    const { user } = useAuth();

    // Stati per i form (puoi separarli o unirli)
    const [userData, setUserData]   = useState({ name: user.name, surname: user.surname, email: user.email, title: user.title });
    const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });

    const handleUserSubmit = (e) => {
        e.preventDefault();
        console.log("Invio dati anagrafici a Laravel...", userData);
        // Qui andrà la tua chiamata axios.put('/api/user/profile', userData)
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        console.log("Invio cambio password...", passwords);
    };

    return (
        <Sidebar visible={visible} onHide={onHide} position="right" style={{ width: '60rem' }}>
            <div className="p-fluid">
                {/* Form Dati Anagrafici */}
                <form onSubmit={handleUserSubmit}>
                    <h5>Informazioni Account</h5>
                    <div className="field mt-3">
                        <label htmlFor="title" className="font-bold">Titolo</label>
                        <InputText id="title" value={userData.title} onChange={(e) => setUserData({...userData, title: e.target.value})} />
                    </div>
                    <div className="field mt-3">
                        <label htmlFor="name" className="font-bold">Nome</label>
                        <InputText id="name" value={userData.name} onChange={(e) => setUserData({...userData, name: e.target.value})} />
                    </div>
                    <div className="field mt-3">
                        <label htmlFor="surname" className="font-bold">Cognome</label>
                        <InputText id="surname" value={userData.surname} onChange={(e) => setUserData({...userData, surname: e.target.value})} />
                    </div>
                    <div className="field mt-3">
                        <label htmlFor="email" className="font-bold">Email</label>
                        <InputText id="email" value={userData.email} onChange={(e) => setUserData({...userData, email: e.target.value})} />
                    </div>
                    <Button type="submit" label="Salva Modifiche" icon="pi pi-check" className="p-button-sm" />
                </form>

                <Divider />

                {/* Form Sicurezza */}
                <form onSubmit={handlePasswordSubmit}>
                    <h5>Sicurezza</h5>
                    <div className="field mt-3">
                        <label htmlFor="current_password">Password corrente</label>
                        <Password
                            autoComplete="new-password"
                            value={passwords.current}
                            onChange={(e) => setPasswords({...passwords, current: e.target.value})}
                            toggleMask feedback={false}
                        />
                    </div>
                    <div className="field mt-3">
                        <label htmlFor="new_password">Nuova Password</label>
                        <Password
                            autoComplete="new-password"
                            value={passwords.new}
                            onChange={(e) => setPasswords({...passwords, new: e.target.value})}
                            toggleMask feedback={true}
                        />
                    </div>
                    <div className="field mt-3">
                        <label htmlFor="confirm_password">Conferma Password</label>
                        <Password
                            autoComplete="new-password"
                            value={passwords.confirm}
                            onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
                            toggleMask feedback={false}
                        />
                    </div>
                    <Button type="submit" label="Aggiorna Password" icon="pi pi-lock" className="p-button-warning p-button-sm" />
                </form>
            </div>
        </Sidebar>
    );
};

export default ProfileSidebar;
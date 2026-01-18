/* eslint-disable @next/next/no-img-element */
'use client';
import { useRouter } from 'next/navigation';
import React, { useEffect, useContext, useState, useRef } from 'react';
import { Button } from 'primereact/button';
import { LayoutContext } from '../../../../layout/context/layoutcontext';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';

import { authService } from '@/services/authService'; 

import Link from 'next/link';

import { Toast } from 'primereact/toast';

const ForgotPasswordPage = () => {

    const { layoutConfig } = useContext(LayoutContext);

    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });

    const [loading, setLoading] = useState(false);

    const [success, setSuccess] = useState(false);
    const [errors, setErrors] = useState({});
    
    const [accessEmail, setAccessEmail] = useState({
        email: '',
        //password: '',
    });
    

    const toast = useRef(null);

    const onConfirmRestorePassword = async (e: { preventDefault: () => void; }) => {

        let _errors = {};

        // Validazione Email
        if (!accessEmail.email) {
            _errors.email = ["L'email è obbligatoria"];
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(accessEmail.email)) {
            _errors.email = ["Formato email non valido"];
        }

        if (Object.keys(_errors).length > 0) {
            setErrors(_errors);
            return;
        }

        setLoading(true);

        setErrors({}); // Resetta gli errori ad ogni tentativo

        try {
            const resp = await authService.forgotPassword(accessEmail.email);
            setSuccess(true);
            toast.current.show({severity:'success', summary: 'Successo', detail: 'Richiesta inviata con successo', life: 3000});    
        } catch (error) {
            if (error.response && error.response.status === 422) {
                setErrors(error.response.data.errors);
            } else {
                console.error('Errore generico:', error);
                toast.current.show({severity:'error', summary: 'Errore', detail: 'Errore generico', life: 3000});
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={containerClassName}>
            <div className="flex flex-column align-items-center justify-content-center">
                <img src={`/layout/images/logo-${layoutConfig.colorScheme === 'light' ? 'dark' : 'white'}.svg`} alt="Sakai logo" className="mb-5 w-6rem flex-shrink-0" />
                <div
                    style={{
                        borderRadius: '56px',
                        padding: '0.3rem',
                        background: 'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)'
                    }}
                >
                    <div className="w-full surface-card py-8 px-5 sm:px-8" style={{ borderRadius: '53px' }}>

                        {success ? 
                        <div>
                            <h2 className="text-900 font-bold text-3xl mb-2">Richiesta inviata!</h2>
                            <p>Se l'email inserita è corretta, riceverai a breve le istruzioni per reimpostare la password.</p>
                            <div className="flex align-items-center justify-content-end mb-5 gap-5">
                                <Link href="/auth/login" className="font-medium no-underline ml-2 text-right cursor-pointer" style={{ color: 'var(--primary-color)' }}>
                                    Torna al login
                                </Link>
                            </div>
                        </div>
                        :
                        <div>

                            <div className="field">
                                <label htmlFor="email" className="block text-900 text-xl font-medium mb-2">Email utilizzata per accedere</label>
                                <InputText 
                                    id="email" 
                                    disabled={loading}
                                    value={accessEmail.email} 
                                    onChange={(e) => setAccessEmail({...accessEmail, email: e.target.value})}
                                    // Se c'è un errore per 'email', aggiunge la classe p-invalid
                                    className={classNames('w-full md:w-30rem', { 'p-invalid': errors.email })} 
                                    style={{ padding: '1rem' }} 
                                />
                                {/* Mostra il primo messaggio di errore se esiste */}
                                {errors.email && <small className="p-error block mt-1">{errors.email[0]}</small>}
                            </div>

                            <div className="flex align-items-center justify-content-end mb-5 gap-5">
                                <Link href="/auth/login" className="font-medium no-underline ml-2 text-right cursor-pointer" style={{ color: 'var(--primary-color)' }}>
                                    Annulla
                                </Link>
                            </div>

                            <Button label="Invia" loading={loading} onClick={onConfirmRestorePassword} className="w-full p-3 text-xl"></Button>

                        </div>
                        }
                    </div>
                </div>
            </div>
            <Toast ref={toast} />
        </div>
    );
};

export default ForgotPasswordPage;

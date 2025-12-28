/* eslint-disable @next/next/no-img-element */
'use client';
import { useRouter } from 'next/navigation';
import React, { useEffect, useContext, useState, useRef } from 'react';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { LayoutContext } from '../../../../layout/context/layoutcontext';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';

import { authService } from '@/services/authService'; 
import { useAuth } from '@/layout/context/authcontext';

import { Toast } from 'primereact/toast';

const LoginPage = () => {

    const { layoutConfig } = useContext(LayoutContext);

    const { setUser } = useAuth();

    const router = useRouter();
    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });

    const [loading, setLoading] = useState(false);

    const [errors, setErrors] = useState({});
    
    const [userCredentials, setUserCredentials] = useState({
        email: '',
        password: '',
    });
    

    const toast = useRef(null);

    const onLogin = async (e: { preventDefault: () => void; }) => {

        setLoading(true);

        setErrors({}); // Resetta gli errori ad ogni tentativo

        try {
            const resp = await authService.login(userCredentials);
            setUser(resp.data);
            router.push('/'); 
        } catch (error) {
            if (error.response && error.response.status === 422) {
                // Laravel restituisce gli errori in questo formato: 
                // { message: "...", errors: { email: ["..."], password: ["..."] } }
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

                        {/* 
                        <div className="text-center mb-5">
                            <img src="/demo/images/login/avatar.png" alt="Image" height="50" className="mb-3" />
                            <div className="text-900 text-3xl font-medium mb-3">Welcome, Isabel!</div>
                            <span className="text-600 font-medium">Sign in to continue</span>
                        </div>
                        */}

                        <div>

                            <div className="field">
                                <label htmlFor="email" className="block text-900 text-xl font-medium mb-2">Email</label>
                                <InputText 
                                    id="email" 
                                    value={userCredentials.email} 
                                    onChange={(e) => setUserCredentials({...userCredentials, email: e.target.value})}
                                    // Se c'è un errore per 'email', aggiunge la classe p-invalid
                                    className={classNames('w-full md:w-30rem', { 'p-invalid': errors.email })} 
                                    style={{ padding: '1rem' }} 
                                />
                                {/* Mostra il primo messaggio di errore se esiste */}
                                {errors.email && <small className="p-error block mt-1">{errors.email[0]}</small>}
                            </div>

                            <div className="field">
                                <label htmlFor="password" className="block text-900 font-medium text-xl mb-2">Password</label>
                                <Password 
                                    inputId="password" 
                                    value={userCredentials.password}
                                    onChange={(e) => setUserCredentials({...userCredentials, password: e.target.value})}
                                    toggleMask 
                                    className="w-full" 
                                    // Nota: p-invalid va applicato all'input interno di Password tramite inputClassName
                                    inputClassName={classNames('w-full p-3 md:w-30rem', { 'p-invalid': errors.password })}
                                    feedback={false}
                                />
                                {errors.password && <small className="p-error block mt-1">{errors.password[0]}</small>}
                            </div>

                            {/*
                            <label htmlFor="email" className="block text-900 text-xl font-medium mb-2">
                                Email
                            </label>
                            <InputText
                                id="email" type="text" disabled={loading}
                                value={userCredentials.email} onChange={(e) => setUserCredentials({...userCredentials, email: e.target.value})}
                                placeholder="Indirizzo email" className="w-full md:w-30rem mb-5" style={{ padding: '1rem' }} />
                                <br/>
                            {errors.email && <small className="p-error">{errors.email[0]}</small>}

                            <label htmlFor="password" className="block text-900 font-medium text-xl mb-2">
                                Password
                            </label>
                            <Password  
                                inputId="password"
                                value={userCredentials.password} disabled={loading}
                                onChange={(e) => setUserCredentials({...userCredentials, password: e.target.value})}
                                placeholder="Password" toggleMask className="w-full mb-5" inputClassName="w-full p-3 md:w-30rem"></Password>
                            {errors.password && <small className="p-error">{errors.password[0]}</small>}
                            */}

                            {/*
                            <div className="flex align-items-center justify-content-between mb-5 gap-5">
                                <div className="flex align-items-center">
                                    <Checkbox inputId="rememberme1" checked={checked} onChange={(e) => setChecked(e.checked ?? false)} className="mr-2"></Checkbox>
                                    <label htmlFor="rememberme1">Remember me</label>
                                </div>
                                <a className="font-medium no-underline ml-2 text-right cursor-pointer" style={{ color: 'var(--primary-color)' }}>
                                    Forgot password?
                                </a>
                            </div>
                            */}

                            <Button label="Accedi" loading={loading} onClick={onLogin} className="w-full p-3 text-xl"></Button>
                        </div>
                    </div>
                </div>
            </div>
            <Toast ref={toast} />
        </div>
    );
};

export default LoginPage;

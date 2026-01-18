/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useEffect, useContext, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { LayoutContext } from '../../../../layout/context/layoutcontext';
import { classNames } from 'primereact/utils';
import Link from 'next/link';
import { Button } from 'primereact/button';

const ResetPasswordPage = () => {
    const { layoutConfig } = useContext(LayoutContext);
    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });
    
    const searchParams = useSearchParams();
    const [resetStatus, setResetStatus] = useState<string | null>(null);

    useEffect(() => {
        const status = searchParams.get('reset');
        setResetStatus(status);
    }, [searchParams]);

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
                    <div className="w-full surface-card py-8 px-5 sm:px-8" style={{ borderRadius: '53px', maxWidth: '450px' }}>

                        {resetStatus === 'success' &&
                            <div className="text-center">
                                <div className="flex align-items-center justify-content-center bg-green-100 border-round-circle m-auto mb-4" style={{ width: '80px', height: '80px' }}>
                                    <i className="pi pi-check-circle text-green-500 text-5xl"></i>
                                </div>
                                <h2 className="text-900 font-bold text-3xl mb-3">Email inviata!</h2>
                                <p className="text-600 line-height-3 mb-5">
                                    Abbiamo generato una <strong>nuova password temporanea</strong> e l'abbiamo spedita al Suo indirizzo email. Controlla anche la cartella spam.
                                </p>
                            </div>
                        }
                        {resetStatus === 'error' &&
                            <div className="text-center">
                                <div className="flex align-items-center justify-content-center bg-orange-100 border-round-circle m-auto mb-4" style={{ width: '80px', height: '80px' }}>
                                    <i className="pi pi-exclamation-triangle text-orange-500 text-5xl"></i>
                                </div>
                                <h2 className="text-900 font-bold text-3xl mb-3">Link non valido</h2>
                                <p className="text-600 line-height-3 mb-5">
                                    Spiacenti, il link per il recupero password è <strong>scaduto o è stato già utilizzato</strong>. Per motivi di sicurezza, i link hanno una durata limitata.
                                </p>
                            </div>
                        }
                        
                        <div className="flex flex-column gap-3">
                            <Link href="/auth/login" className="no-underline">
                                <Button 
                                    label="Torna al Login" 
                                    icon="pi pi-arrow-left" 
                                    className="w-full p-3 text-xl" 
                                />
                            </Link>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
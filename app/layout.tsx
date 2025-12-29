'use client';
import { LayoutProvider } from '../layout/context/layoutcontext';
import { PrimeReactProvider, addLocale, locale } from 'primereact/api'; // Importa addLocale e locale
import { AuthProvider } from '@/layout/context/authcontext';

import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import '../styles/layout/layout.scss';

// 1. Configura la lingua FUORI dal componente per evitare riesecuzioni inutili
const setupItalian = () => {
    if (typeof window !== 'undefined') {
        addLocale('it', {
            passwordPrompt: 'Inserisci una password',
            weak: 'Debole',
            medium: 'Media',
            strong: 'Forte',
            accept: 'Sì',
            reject: 'No',
            choose: 'Scegli',
            upload: 'Carica',
            cancel: 'Annulla',
            dayNames: ["Domenica", "Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato"],
            dayNamesShort: ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"],
            dayNamesMin: ["D", "L", "M", "M", "G", "V", "S"],
            monthNames: ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno", "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"],
            monthNamesShort: ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"],
            today: 'Oggi',
            clear: 'Pulisci'
        });
        locale('it');
    }
};

setupItalian();

interface RootLayoutProps {
    children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
    // 2. Passa le impostazioni al PrimeReactProvider tramite la prop 'value'
    const value = {
        ripple: true,
        locale: 'it'
    };

    return (
        <html lang="it" suppressHydrationWarning>
            <head>
                <link id="theme-css" href={`/themes/lara-light-indigo/theme.css`} rel="stylesheet"></link>
            </head>
            <body>
                <PrimeReactProvider value={value}>
                    <AuthProvider>
                        <LayoutProvider>{children}</LayoutProvider>
                    </AuthProvider>
                </PrimeReactProvider>
            </body>
        </html>
    );
}
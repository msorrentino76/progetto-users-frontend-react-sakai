import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    }
});

/**
 * 1. INTERCEPTOR DI RICHIESTA
 * Si assicura che il token XSRF sia decodificato correttamente prima dell'invio
 */
api.interceptors.request.use(config => {
    const name = 'XSRF-TOKEN=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const ca = decodedCookie.split(';');
    let token = '';
    
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i].trim();
        if (c.indexOf(name) === 0) {
            token = c.substring(name.length, c.length);
        }
    }

    if (token) {
        config.headers['X-XSRF-TOKEN'] = token;
    }
    return config;
}, error => Promise.reject(error));

/**
 * 2. INTERCEPTOR DI RISPOSTA
 * Gestisce globalmente gli errori di sessione (401 o 419)
 */
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // 401: Non autorizzato (sessione scaduta o mai fatta)
        // 419: CSRF Token mismatch (sessione scaduta lato server)
        if (error.response && [401, 419].includes(error.response.status)) {
            // Evitiamo il redirect infinito se siamo già nella pagina di login
            if (typeof window !== 'undefined' && !window.location.pathname.includes('/auth/login')) {
                // Opzionale: qui potresti emettere un evento per pulire l'AuthContext
                window.location.href = '/auth/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
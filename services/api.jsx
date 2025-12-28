import axios from 'axios';

// NEXT_PUBLIC_BASE_URL non ha /api perchè viene usato per altre chiamate non API
// per esempio la rotta build-in /sanctum/csrf-cookie di Laravel Sanctum
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
    headers: {
        'Content-Type': 'application/json', // specifica il contenuto inviato
        'Accept': 'application/json',       // specifica il contenuto accettato
        'X-Requested-With': 'XMLHttpRequest', 
    },
    // Queste due righe dicono ad Axios dove leggere il token e come inviarlo
    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN',
    withCredentials: true, // include i cookie nelle richieste
});

api.interceptors.request.use(config => {
    // 1. Cerchiamo il cookie XSRF-TOKEN nel browser
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

    // 2. Se lo troviamo, lo iniettiamo decodificato nell'header
    if (token) {
        config.headers['X-XSRF-TOKEN'] = token;
    }

    return config;
}, error => {
    return Promise.reject(error);
});

export default api;
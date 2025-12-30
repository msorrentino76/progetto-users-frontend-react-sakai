import api from './api';

export const authService = {
    /**
     * Esegue la procedura di login completa.
     * Include l'inizializzazione del cookie CSRF richiesta da Sanctum.
     * @param {Object} credentials - Oggetto con email e password
     */
    async login(credentials) {
        // 1. Inizializza la protezione CSRF
        await api.get('/sanctum/csrf-cookie');
        
        // 2. Invia i dati di login
        // Laravel Sanctum/Fortify risponde con 200/204 se OK
        return api.post('/login', credentials);
    },

    /**
     * (Opzionale) Esempio di registrazione utente
     */
    async register(data) {
        await api.get('/sanctum/csrf-cookie');
        return api.post('/register', data);
    },

    /**
     * (Opzionale) Invio email per reset password
     */
    async forgotPassword(email) {
        await api.get('/sanctum/csrf-cookie');
        return api.post('/forgot-password', { email });
    },
    
    /**
     * Effettua il logout distruggendo la sessione su Laravel.
     */
    async logout() {
        return api.post('/logout');
    },

    /**
     * Recupera i dati dell'utente attualmente autenticato.
     * Viene usato all'avvio dell'app per verificare se la sessione è attiva.
     */
    async getUserProfile() {
        return api.get('/api/user');
    },

    async putUserProfile(userData) {
        return api.put('/api/user' , userData);
    },

    async putUserPassword(passwords) {
        return api.put('/api/user-password', passwords);
    },

};
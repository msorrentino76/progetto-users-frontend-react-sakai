export const ROLE_TRANSCODER = {
    'admin': {
        label: 'Amministratore',
        icon: 'pi pi-shield',
        severity: 'danger' // Per i Badge di PrimeReact
    },
    'backoffice': {
        label: 'Operatore Backoffice',
        icon: 'pi pi-briefcase',
        severity: 'info'
    },
    'user': {
        label: 'Utente Base',
        icon: 'pi pi-user',
        severity: 'success'
    }
};

// Funzione helper per evitare crash se il ruolo non esiste
export const _role = (role) => ROLE_TRANSCODER[role] || { label: role, severity: 'secondary' };
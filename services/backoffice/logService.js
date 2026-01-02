import api from '../common/api';

export const logService = {
    
    async getLogs() {
        return api.get('/api/backoffice/logs');
    },

    async getLogDetails(fileName) {
        return api.get(`/api/backoffice/log/${fileName}`);
    },

    async deleteLog(fileName) {
        return api.delete(`/api/backoffice/log/${fileName}`);
    },
    
};
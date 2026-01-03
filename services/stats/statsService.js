import api from '../common/api';

export const statsService = {

    async getStatsUsersByRole() {
        return api.get('/api/stats/users-by-role');
    },
    
};
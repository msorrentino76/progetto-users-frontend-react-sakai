import api from '../common/api';

export const usersService = {
    
    async getAllUsers() {
        return api.get('/api/admin/users');
    },

};
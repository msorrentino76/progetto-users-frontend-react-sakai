import api from '../common/api';

export const usersService = {
    
    async getAllUsers() {
        return api.get('/api/admin/users');
    },

    async toggleUserBan(userId) {
        return api.put(`/api/admin/user/${userId}/toggle-ban`);
    },

    async deleteUser(userId) {
        return api.delete(`/api/admin/user/${userId}`);
    },
    
};
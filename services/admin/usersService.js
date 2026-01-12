import api from '../common/api';

export const usersService = {
    
    async getAllUsers() {
        return api.get('/api/staff/users');
    },

    async saveUser(userId, userData) {
        if (userId) {
            return this.putUser(userId, userData); 
        } else {
            return this.postUser(userData); 
        }
    },
    
    async postUser(userData) {
        return api.post(`/api/staff/user`, userData);
    },

    async putUser(userId, userData) {
        return api.put(`/api/staff/user/${userId}`, userData);
    },        

    async deleteUser(userId) {
        return api.delete(`/api/staff/user/${userId}`);
    },

    async resetPasswordUser(userId) {
        return api.put(`/api/staff/user/${userId}/reset-pwd`);
    },

    async toggleUserBan(userId) {
        return api.put(`/api/staff/user/${userId}/toggle-ban`);
    },
};
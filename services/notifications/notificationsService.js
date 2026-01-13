import api from '../common/api';

export const notificationsService = {
    
    async getUnread() {
        return api.get('/api/notifications/unread-count');
    },
    
    async getNotifications() {
        return api.get('/api/notifications');
    },

    async markAllAsRead() {
        return api.post('/api/notifications/mark-all-as-read');
    }
};
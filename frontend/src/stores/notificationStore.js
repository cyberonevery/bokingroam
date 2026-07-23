import { writable } from 'svelte/store';
import { api } from '../lib/api';

const createNotificationStore = () => {
  const { subscribe, set, update } = writable({
    notifications: [],
    unreadCount: 0
  });

  return {
    subscribe,
    fetchNotifications: async () => {
      try {
        const res = await api.get('/notifications');
        if (res.success) {
          const notifs = res.data;
          set({
            notifications: notifs,
            unreadCount: notifs.filter(n => !n.isRead).length
          });
        }
      } catch (err) {
        console.error("Gagal memuat notifikasi", err);
      }
    },
    markAsRead: async (id) => {
      try {
        const res = await api.patch(`/notifications/${id}/read`);
        if (res.success) {
          update(state => {
            const updatedNotifs = state.notifications.map(n => 
              n.id === id ? { ...n, isRead: true } : n
            );
            return {
              notifications: updatedNotifs,
              unreadCount: updatedNotifs.filter(n => !n.isRead).length
            };
          });
        }
      } catch (err) {
        console.error("Gagal update notifikasi", err);
      }
    }
  };
};

export const notificationStore = createNotificationStore();

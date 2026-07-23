import { writable } from 'svelte/store';
import { navigate } from 'svelte-routing';

const createAuthStore = () => {
  const { subscribe, set, update } = writable({
    isAuthenticated: false,
    user: null,
    token: null
  });

  return {
    subscribe,
    init: () => {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      
      if (token && userStr) {
        try {
          const user = JSON.parse(userStr);
          set({ isAuthenticated: true, user, token });
        } catch (e) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
    },
    login: (token, user) => {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      set({ isAuthenticated: true, user, token });
      navigate('/');
    },
    logout: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      set({ isAuthenticated: false, user: null, token: null });
      navigate('/');
    }
  };
};

export const auth = createAuthStore();

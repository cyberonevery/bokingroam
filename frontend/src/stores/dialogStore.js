import { writable } from 'svelte/store';

export const dialogStore = writable(null);

export const dialog = {
  alert: (message, title = "Pemberitahuan Sistem") => {
    return new Promise((resolve) => {
      dialogStore.set({
        type: 'alert',
        title,
        message,
        onConfirm: () => {
          dialogStore.set(null);
          resolve(true);
        }
      });
    });
  },
  confirm: (message, title = "Konfirmasi Aksi") => {
    return new Promise((resolve) => {
      dialogStore.set({
        type: 'confirm',
        title,
        message,
        onConfirm: () => {
          dialogStore.set(null);
          resolve(true);
        },
        onCancel: () => {
          dialogStore.set(null);
          resolve(false);
        }
      });
    });
  }
};

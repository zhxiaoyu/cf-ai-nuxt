import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        showAuthDialog: false,
    }),
    actions: {
        showDialog() {
            this.showAuthDialog = true;
        },
        hideDialog() {
            this.showAuthDialog = false;
        },
    },
});
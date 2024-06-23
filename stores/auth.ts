import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        isAuthenticated: false,
        showAuthDialog: false,
        targetRoute: '/',
    }),
    actions: {
        async authenticate(password: string) {
            try {
                const response = await $fetch('/api/auth', {
                    method: 'POST',
                    body: { password },
                });

                if (response) {
                    this.isAuthenticated = true;
                    this.showAuthDialog = false;
                    if (import.meta.client) {
                        localStorage.setItem('userPassword', password);
                    }
                    return true;
                } else {
                    this.isAuthenticated = false;
                    throw new Error('密码错误');
                }
            } catch (error) {
                this.isAuthenticated = false;
                throw new Error('密码错误');
            }
        },
        promptAuthentication(targetRoute: string) {
            this.targetRoute = targetRoute;
            this.showAuthDialog = true;
        },
        cancelAuthentication() {
            this.showAuthDialog = false;
        },
    },
});

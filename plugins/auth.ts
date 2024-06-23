import { defineNuxtPlugin } from '#app';
import { useRouter } from 'vue-router';
import { useAuthStore } from '~/stores/auth';

export default defineNuxtPlugin(() => {
    if (process.client) {
        const router = useRouter();
        const authStore = useAuthStore();

        router.beforeEach(async (to, from, next) => {
            if (to.path === '/') {
                return next();
            }

            const storedPassword = localStorage.getItem('userPassword');
            if (storedPassword) {
                try {
                    const response = await $fetch('/api/auth', {
                        method: 'POST',
                        body: { password: storedPassword },
                    });

                    if (response.success) {
                        authStore.isAuthenticated = true;
                        return next();
                    } else {
                        authStore.promptAuthentication(to.fullPath);
                    }
                } catch (error) {
                    authStore.promptAuthentication(to.fullPath);
                }
            } else {
                authStore.promptAuthentication(to.fullPath);
            }
        });
    }
});

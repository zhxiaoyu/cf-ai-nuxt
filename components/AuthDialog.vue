<template>
    <v-dialog v-model="dialog" persistent max-width="400px">
        <v-card>
            <v-card-title class="headline">密码验证</v-card-title>
            <v-card-text>
                <v-text-field v-model="password" label="请输入密码" type="password" @keyup.enter="verifyPassword" />
            </v-card-text>
            <v-card-actions>
                <v-btn color="primary" @click="verifyPassword">验证</v-btn>
                <v-btn color="secondary" @click="cancel">取消</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '~/stores/auth';

const dialog = ref(true);
const password = ref('');
const router = useRouter();
const authStore = useAuthStore();

const verifyPassword = async () => {
    try {
        await authStore.authenticate(password.value);
        router.push(authStore.targetRoute);
    } catch (error) {
        alert(error);
    }
};

const cancel = () => {
    authStore.cancelAuthentication();
    router.push('/');
};

onMounted(() => {
    if (process.client) {
        const storedPassword = localStorage.getItem('userPassword');
        if (storedPassword) {
            authStore.authenticate(storedPassword).catch(() => {
                authStore.promptAuthentication('/');
            });
        } else {
            authStore.promptAuthentication('/');
        }
    }
});
</script>

<style scoped>
.v-card {
    width: 100%;
}
</style>
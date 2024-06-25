<template>
    <v-dialog v-model="authStore.showAuthDialog" persistent max-width="400px">
        <v-card>
            <v-card-title class="headline">密码验证</v-card-title>
            <v-card-text>
                <v-text-field v-model="password" label="请输入密码" type="password" @keyup.enter="verifyPassword" />
            </v-card-text>
            <v-card-actions>
                <v-btn color="primary" @click="verifyPassword">确认</v-btn>
                <v-btn color="secondary" @click="cancel">取消</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore();
const password = ref('');

const verifyPassword = async () => {
    localStorage.setItem('userPassword', password.value);
    authStore.hideDialog();
};

const cancel = () => {
    authStore.hideDialog();
};

</script>

<style scoped>
.v-card {
    width: 100%;
}
</style>
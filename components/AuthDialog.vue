<template>
    <v-dialog v-model="authStore.showAuthDialog" persistent max-width="400px">
        <v-card>
            <v-card-title class="headline">Password Verification</v-card-title>
            <v-card-text>
                <v-text-field v-model="password" label="Please enter password" type="password" @keyup.enter="verifyPassword" />
            </v-card-text>
            <v-card-actions>
                <v-btn color="primary" @click="verifyPassword">Confirm</v-btn>
                <v-btn color="secondary" @click="cancel">Cancel</v-btn>
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
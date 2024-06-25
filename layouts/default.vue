<template>
    <v-app>
        <NavBar />
        <v-main>
            <NuxtPage />
        </v-main>
        <AuthDialog />
    </v-app>
</template>

<script setup lang="ts">
import NavBar from '~/components/NavBar.vue';
import AuthDialog from '~/components/AuthDialog.vue';
import { useAuthStore } from '~/stores/auth';
import { onMounted } from 'vue';

const authStore = useAuthStore();

onMounted(() => {
    const savedPassword = localStorage.getItem('userPassword');
    if (!savedPassword) {
        authStore.showDialog();
    }
});
</script>
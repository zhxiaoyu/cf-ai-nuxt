<template>
    <v-app>
        <NavBar />
        <v-main>
            <NuxtPage />
        </v-main>
        <AuthDialog v-if="authStore.showAuthDialog" />
    </v-app>
</template>

<script setup lang="ts">
import NavBar from '~/components/NavBar.vue';
import AuthDialog from '~/components/AuthDialog.vue';
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore();
</script>
<template>
    <v-app-bar app color="primary" dark>
        <v-toolbar-title>Cloudflare AI WebUI</v-toolbar-title>
    </v-app-bar>
    <v-navigation-drawer app permanent>
        <v-list>
            <v-list-item v-for="item in items" :key="item.title" @click="navigate(item)">
                <v-list-item-content>
                    <v-list-item-title>
                        <v-icon left>{{ item.icon }}</v-icon>
                        {{ item.title }}
                    </v-list-item-title>
                </v-list-item-content>
            </v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const items = [
    { title: 'Home', icon: 'mdi-home', path: '/' },
    { title: 'Text to Image', icon: 'mdi-image', path: '/text-to-image' },
    { title: 'Text Generation', icon: 'mdi-text', path: '/text-generation' },
    { title: 'Translation', icon: 'mdi-translate', path: '/translation' }
];

const navigate = (item: { path: string }) => {
    router.push(item.path);
};
</script>

<style scoped>
.v-list-item {
    cursor: pointer;
}
</style>
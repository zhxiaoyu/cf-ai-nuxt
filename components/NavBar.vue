<template>
    <v-app-bar app color="primary" dark>
        <v-toolbar-title>Cloudflare AI WebUI</v-toolbar-title>
    </v-app-bar>
    <v-navigation-drawer app permanent>
        <v-list>
            <v-list-item v-for="item in items" :key="item.title" @click="navigate(item)">
                <v-list-item-title>
                    <v-icon left>{{ item.icon }}</v-icon>
                    {{ item.title }}
                </v-list-item-title>
            </v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const items = [
    { title: 'Home', icon: 'mdi-home', path: '/' },
    { title: 'Text to Image', icon: 'mdi-image-plus', path: '/text-to-image' },
    { title: 'Image to Image', icon: 'mdi-image-refresh', path: '/img-to-img' },
    { title: 'Image Inpaint', icon: 'mdi-image-edit', path: '/img-inpaint' },
    { title: 'Image to Text', icon: 'mdi-image-text', path: '/img-to-txt' },
    { title: 'Translation', icon: 'mdi-translate', path: '/translation' },
    { title: 'Summarization', icon: 'mdi-text-box-check-outline', path: '/summarization' },
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
<template>
    <v-container>
        <v-row>
            <v-col cols="12" md="6">
                <v-select v-model="selectedModel" :items="models" label="Select a model" required />
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" md="6">
                <v-file-input v-model="sourceImage" label="Upload an image" accept="image/*" show-size required />
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <v-textarea v-model="prompt" label="Input prompt (prefer English)" auto-grow outlined required />
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" class="text-center">
                <v-btn :loading="loading" color="primary" @click="generateImage">Generate Image</v-btn>
            </v-col>
        </v-row>
        <v-row v-if="generatedImage">
            <v-col cols="12">
                <v-img :src="generatedImage" aspect-ratio="1.7" @click="showFullscreen = true"></v-img>
            </v-col>
        </v-row>
        <v-dialog v-model="showFullscreen" fullscreen hide-overlay persistent>
            <v-card v-if="generatedImage">
                <v-img :src="generatedImage" @click="showFullscreen = false"></v-img>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '~/stores/auth';

const models = [
    '@cf/runwayml/stable-diffusion-v1-5-img2img',
];

const selectedModel = ref(models[0]);
const sourceImage = ref<File | null>(null);
const prompt = ref('');
const generatedImage = ref<string | null>(null);
const showFullscreen = ref(false);
const loading = ref(false);
const authStore = useAuthStore();

const generateImage = async () => {
    if (!sourceImage.value) return;

    loading.value = true;

    try {
        const arrayBuffer = await sourceImage.value.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer);
        const requestBody = {
            model: selectedModel.value,
            prompt: prompt.value,
            image: [...uint8Array]
        };

        const res = await fetch('/api/img2img', {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json',
                Authorization: `token ${localStorage.getItem('userPassword')}`
            }
        });

        if (res.ok) {
            const blob = await res.blob();
            generatedImage.value = window.URL.createObjectURL(blob);
        } else if (res.status === 401) {
            authStore.showDialog();
        } else {
            const errorText = await res.text();
            console.error('Error:', res.status, errorText);
        }
    } catch (error) {
        console.error('Fetch error:', error);
        authStore.showDialog();
    } finally {
        loading.value = false;
    }
};
</script>

<style scoped>
.text-center {
    text-align: center;
}
</style>
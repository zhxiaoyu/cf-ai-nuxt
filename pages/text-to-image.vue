<template>
    <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
            <v-col cols="12" md="8" lg="6">
                <v-card>
                    <v-card-title>
                        Text-to-Image Generator
                    </v-card-title>
                    <v-card-text>
                        <v-form @submit.prevent="generateImage">
                            <v-select v-model="selectedModel" :items="models" label="Select a model" required />
                            <v-text-field v-model="promptStr" label="Input prompt (prefer English)" required />
                            <v-btn color="primary" type="submit" :loading="loading">
                                Generate Image
                            </v-btn>
                        </v-form>
                    </v-card-text>
                </v-card>
                <v-card v-if="generatedImage">
                    <v-img :src="generatedImage" aspect-ratio="1.7" @click="showImageFullScreen = true"></v-img>
                </v-card>
            </v-col>
        </v-row>

        <v-dialog v-model="showImageFullScreen" fullscreen hide-overlay persistent>
            <v-card v-if="generatedImage">
                <v-img :src="generatedImage" @click="showImageFullScreen = false"></v-img>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore();
const models = [
    '@cf/stabilityai/stable-diffusion-xl-base-1.0',
    '@cf/bytedance/stable-diffusion-xl-lightning',
    '@cf/lykon/dreamshaper-8-lcm',
];
const selectedModel = ref(models[0]);
const promptStr = ref<string>('');
const generatedImage = ref<string | null>(null);
const loading = ref(false);
const showImageFullScreen = ref(false);

const generateImage = async () => {
    loading.value = true;
    try {
        let data = JSON.stringify({
            "model": selectedModel.value,
            "prompt": promptStr.value,
        });
        fetch('/api/text2image', {
            method: 'post',
            body: data,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `token ${localStorage.getItem('userPassword')}`
            },
        }).then(res => {
            if (res.ok) {
                res.blob().then(blob => {
                    generatedImage.value = window.URL.createObjectURL(blob);
                    loading.value = false;
                });
            }
            else if (res.status === 401) {
                authStore.showDialog();
                loading.value = false;
            }    
        });
    } catch (error) {
        loading.value = false;
    }
};
</script>

<style scoped>
form {
    margin-bottom: 20px;
}

form div {
    margin-bottom: 10px;
}
</style>
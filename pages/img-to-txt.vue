<template>
    <v-container>
        <v-row>
            <v-col cols="12" md="6">
                <v-select v-model="selectedModel" :items="models" label="Select a model" required />
            </v-col>
            <v-col cols="12" md="6">
                <v-file-input v-model="imageFile" label="Upload an image" accept="image/*" show-size required />
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <v-text-field v-model="prompt" label="Input text (prefer English)" required />
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <v-btn @click="generateDescription" :loading="loading" color="primary">
                    Generate Description
                </v-btn>
            </v-col>
        </v-row>
        <v-row v-if="description">
            <v-col cols="12">
                <v-card>
                    <v-card-title>Description</v-card-title>
                    <v-card-text>{{ description }}</v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore();

const models = [
    '@cf/llava-hf/llava-1.5-7b-hf',
    '@cf/unum/uform-gen2-qwen-500m',
];
const selectedModel = ref(models[0]);
const prompt = ref('Generate a caption for this image');
const imageFile = ref<File | null>(null);
const loading = ref<boolean>(false);
const description = ref<string | null>(null);


const generateDescription = async () => {
    if (!selectedModel.value || !prompt.value || !imageFile.value) {
        alert('Please ensure that all input values are valid and an image is selected');
        return;
    }

    loading.value = true;

    const imageArrayBuffer = await imageFile.value.arrayBuffer();
    const inputs = {
        model: selectedModel.value,
        prompt: prompt.value,
        image: [...new Uint8Array(imageArrayBuffer)],
    };

    try {
        const res = await fetch('/api/img2text', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `token ${localStorage.getItem('userPassword')}`
            },
            body: JSON.stringify(inputs),
        });

        if (res.ok) {
            const data = await res.json();
            description.value = data.result.description;
        } else if (res.status === 401) {
            authStore.showDialog();
        } else {
            const errorText = await res.text();
            console.error('Error:', res.status, errorText);
        }
    } catch (err) {
        console.error('Error during description generation', err);
    } finally {
        loading.value = false;
    }
};
</script>

<style scoped>
.v-container {
    max-width: 100%;
    margin: 0 auto;
}
</style>
<template>
    <v-container>
        <v-row>
            <v-col cols="12" md="6">
                <v-select v-model="selectedModel" :items="models" label="Select a model" required />
            </v-col>
            <v-col cols="12" md="2">
                <v-text-field v-model="maxLength" label="Max length" type="number" required
                    :rules="[value => value > 0 || 'Must be a positive integer']" />
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <v-textarea v-model="inputText" label="Input text (prefer English)" required rows="15" />
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <v-btn @click="generateSummary" :loading="loading" color="primary">
                    Generate Summary
                </v-btn>
            </v-col>
        </v-row>
        <v-row v-if="summary">
            <v-col cols="12">
                <v-card>
                    <v-card-title>Summary</v-card-title>
                    <v-card-text>{{ summary }}</v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore();

const models = ['@cf/facebook/bart-large-cnn'];
const selectedModel = ref(models[0]);
const inputText = ref<string>('');
const maxLength = ref(1024);
const loading = ref<boolean>(false);
const summary = ref<string | null>(null);

const generateSummary = async () => {
    if (!selectedModel.value || !inputText.value || !maxLength.value) {
        return;
    }

    loading.value = true;

    const payload = {
        model: selectedModel.value,
        input_text: inputText.value,
        max_length: Number(maxLength.value),
    };

    try {
        const res = await fetch('/api/summarization', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `token ${localStorage.getItem('userPassword')}`
            },
            body: JSON.stringify(payload),
        });

        if (res.ok) {
            const data = await res.json();
            summary.value = data.result.summary;
        } else if (res.status === 401) {
            authStore.showDialog();
        }
    } catch (err) {
        console.error('Error during summary generation', err);
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
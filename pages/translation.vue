<template>
    <v-container>
        <v-row>
            <v-col cols="12" md="6">
                <v-select v-model="selectedModel" :items="models" label="Select a model" required />
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="5">
                <v-select v-model="sourceLang" :items="languages" :item-props="itemProps" label="Source language"
                    required />
            </v-col>
            <v-col cols="2" class="text-center">
                <v-btn icon @click="swapLanguages">
                    <v-icon>mdi-swap-horizontal</v-icon>
                </v-btn>
            </v-col>
            <v-col cols="5">
                <v-select v-model="targetLang" :items="languages" :item-props="itemProps" label="target language"
                    required />
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <v-textarea v-model="inputText" label="Input text" auto-grow outlined required />
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" class="text-center">
                <v-btn color="primary" @click="translateText" :loading="loading">Translate</v-btn>
            </v-col>
        </v-row>
        <v-row v-if="translatedText">
            <v-col cols="12">
                <v-textarea v-model="translatedText" label="Translated text" auto-grow outlined readonly />
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import languages from '~/utils/language';
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore();
const models = [
    '@cf/meta/m2m100-1.2b',
];
function itemProps(language: { label: string, value: string }) {
    return {
        title: language.label,
        subtitle: language.value,
    }
}
const selectedModel = ref(models[0]);
const sourceLang = ref(languages[18]);
const targetLang = ref(languages[98]);
const inputText = ref('');
const translatedText = ref('');
const loading = ref(false);

const swapLanguages = () => {
    const temp = sourceLang.value;
    sourceLang.value = targetLang.value;
    targetLang.value = temp;
};

const translateText = async () => {
    loading.value = true;
    try {
        let data = JSON.stringify({
            "model": selectedModel.value,
            "source_lang": sourceLang.value.value,
            "target_lang": targetLang.value.value,
            "text": inputText.value
        });
        fetch('/api/translation', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `token ${localStorage.getItem('userPassword')}`
            },
            body: data,
        }).then(res => {
            if (res.ok) {
                res.json().then(res => {
                    translatedText.value = res.result.translated_text;
                    loading.value = false;
                });
            } else if (res.status === 401) {
                authStore.showDialog();
                loading.value = false;
            }
        })
    } catch (error) {
        console.error(error);
        translatedText.value = 'Translation failed';
        loading.value = false;
    }
};
</script>

<style scoped>
.text-center {
    text-align: center;
}
</style>
<template>
    <div>
        <h1>Text to Image</h1>
        <form @submit.prevent="generateImage">
            <div>
                <label for="model">Select Model:</label>
                <select v-model="selectedModel" required>
                    <option value="@cf/bytedance/stable-diffusion-xl-lightning">Stable Diffusion XL Lightning</option>
                    <option value="@cf/lykon/dreamshaper-8-lcm">Dreamshaper 8 LCM</option>
                    <option value="@cf/stabilityai/stable-diffusion-xl-base-1.0">Stable Diffusion XL Base 1.0</option>
                </select>
            </div>
            <div>
                <label for="prompt">Enter Prompt:</label>
                <input type="text" v-model="promptStr" required />
            </div>
            <button type="submit">Generate Image</button>
        </form>
        <div v-if="generatedImage">
            <h2>Generated Image:</h2>
            <img :src="generatedImage" alt="Generated Image" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';

const selectedModel = ref<string>('');
const promptStr = ref<string>('');
const generatedImage = ref<string | null>(null);

const generateImage = async () => {
    try {
        let data = JSON.stringify({
            "model": selectedModel.value,
            "messages": [
                {
                    "content": promptStr.value
                }
            ]
        });
        axios({
            method: 'post',
            maxBodyLength: Infinity,
            url: '/api/text2image',
            headers: {
                'Content-Type': 'application/json'
            },
            responseType: 'arraybuffer',
            data: data
        }).then(res => {
            const blob = new window.Blob([res.data], { type: 'image/png' });
            const u = window.URL.createObjectURL(blob);
            generatedImage.value = u;
        })
    } catch (error) {
        console.error('Error generating image:', error);
    }
};
const validatePassword = async () => {
    const storedPassword = localStorage.getItem('userPassword');
    if (storedPassword) {
        try {
            const response = await axios.post('/api/auth', { password: storedPassword });
            if (!response.data.success) {
                promptPassword();
            }
        } catch (error) {
            promptPassword();
        }
    } else {
        promptPassword();
    }
};

const promptPassword = async () => {
    const userPassword = prompt('请输入密码:');
    try {
        const response = await axios.post('/api/auth', { password: userPassword });
        if (response.data.success && userPassword) {
            localStorage.setItem('userPassword', userPassword);
        } else {
            alert('密码错误，请重新输入');
            promptPassword();
        }
    } catch (error) {
        alert('密码错误，请重新输入');
        promptPassword();
    }
};

onMounted(() => {
    validatePassword();
});
</script>

<style scoped>
form {
    margin-bottom: 20px;
}

form div {
    margin-bottom: 10px;
}
</style>
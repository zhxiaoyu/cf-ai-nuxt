<template>
    <v-container>
        <v-row>
            <v-col cols="12" md="6">
                <v-select v-model="selectedModel" :items="models" label="选择模型" required />
            </v-col>
            <v-col cols="12" md="6">
                <v-file-input v-model="sourceImage" label="选择源图像" accept="image/*" show-size required
                    @change="onImageUpload" />
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <div v-if="sourceImageUrl" class="image-container">
                    <v-img :src="sourceImageUrl" max-width="100%" ref="imageRef" />
                    <canvas ref="canvasRef" class="drawing-canvas" @mousedown="startDrawing" @mousemove="draw"
                        @mouseup="stopDrawing" @mouseleave="stopDrawing"></canvas>
                </div>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" md="6">
                <v-textarea v-model="prompt" label="输入提示词" required />
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <v-btn @click="generateImage" :loading="loading" color="primary">生成新图像</v-btn>
            </v-col>
        </v-row>
        <v-row v-if="generatedImageUrl">
            <v-col cols="12">
                <div class="image-container">
                    <v-img :src="generatedImageUrl" max-width="100%" />
                </div>
            </v-col>
        </v-row>
    </v-container>
</template>
<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
const models = [
    '@cf/runwayml/stable-diffusion-v1-5-inpainting',
];
const selectedModel = ref(models[0]);
const sourceImage = ref<File | null>(null);
const sourceImageUrl = ref<string | null>(null);
const prompt = ref<string>('');
const canvasRef = ref<HTMLCanvasElement | null>(null);
const context = ref<CanvasRenderingContext2D | null>(null);
const isDrawing = ref<boolean>(false);
const loading = ref<boolean>(false);
const generatedImageUrl = ref<string | null>(null);

onMounted(async () => {
    await nextTick();
    if (canvasRef.value) {
        context.value = canvasRef.value.getContext('2d');
        if (!context.value) {
            console.error('Failed to get 2D context');
        }
    } else {
        console.error('Canvas element not found');
    }
});

const onImageUpload = () => {
    if (sourceImage.value) {
        const reader = new FileReader();
        reader.onload = (e) => {
            sourceImageUrl.value = e.target?.result as string;

            nextTick(() => {
                if (canvasRef.value) {
                    const imgElement = document.querySelector('v-image__image');
                    if (imgElement) {
                        canvasRef.value.width = imgElement.clientWidth;
                        canvasRef.value.height = imgElement.clientHeight;
                    }
                    else{
                        console.error('Image element not found');
                    }
                }
                else{
                    console.error('Canvas element not found');
                }
            });
        };
        reader.readAsDataURL(sourceImage.value);
    }
};

const startDrawing = (event: MouseEvent) => {
    isDrawing.value = true;
    draw(event);
};

const draw = (event: MouseEvent) => {
    if (!isDrawing.value || !context.value || !canvasRef.value) return;

    const rect = canvasRef.value.getBoundingClientRect();
    context.value.lineWidth = 10;
    context.value.lineCap = 'round';
    context.value.strokeStyle = 'red';

    context.value.lineTo(event.clientX - rect.left, event.clientY - rect.top);
    context.value.stroke();
    context.value.beginPath();
    context.value.moveTo(event.clientX - rect.left, event.clientY - rect.top);
};

const stopDrawing = () => {
    if (!context.value) return;

    context.value.closePath();
    isDrawing.value = false;
};

const generateImage = async () => {
    if (!selectedModel.value || !sourceImage.value || !prompt.value || !canvasRef.value) {
        return;
    }

    loading.value = true;

    const imageArrayBuffer = await sourceImage.value.arrayBuffer();
    const maskArrayBuffer = await getCanvasArrayBuffer(canvasRef.value);

    const inputs = {
        model: selectedModel.value,
        prompt: prompt.value,
        image: [...new Uint8Array(imageArrayBuffer)],
        mask: [...new Uint8Array(maskArrayBuffer)]
    };

    try {
        const res = await fetch('/api/imginpaint', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(inputs)
        });

        if (res.ok) {
            const blob = await res.blob();
            generatedImageUrl.value = URL.createObjectURL(blob);
        } else {
            console.error('Failed to generate image', res);
        }
    } catch (err) {
        console.error('Error during image generation', err);
    } finally {
        loading.value = false;
    }
};

const getCanvasArrayBuffer = (canvas: HTMLCanvasElement): Promise<ArrayBuffer> => {
    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (blob) {
                const reader = new FileReader();
                reader.onload = () => {
                    resolve(reader.result as ArrayBuffer);
                };
                reader.onerror = reject;
                reader.readAsArrayBuffer(blob);
            } else {
                reject(new Error('Failed to convert canvas to blob'));
            }
        });
    });
};
</script>
<style scoped>
.image-container {
    position: relative;
}

.drawing-canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    border: 1px solid #ccc;
}

canvas {
    pointer-events: all;
}
</style>
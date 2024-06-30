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
            <v-col cols="12" md="1">
                <v-btn @click="undoLastDraw" color="primary">撤销</v-btn>
            </v-col>
            <v-col cols="12" md="1">
                <v-btn @click="clearAll" color="primary">重置</v-btn>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <div v-if="sourceImageUrl" class="image-container">
                    <img :src="sourceImageUrl" max-width="100%" ref="imageRef" />
                    <canvas ref="canvasRef" class="drawing-canvas" @mousedown="startDrawing" @mousemove="draw"
                        @mouseup="stopDrawing" @mouseleave="stopDrawing" />
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
import { useAuthStore } from '~/stores/auth';

const authStore = useAuthStore();
const models = [
    '@cf/runwayml/stable-diffusion-v1-5-inpainting',
];
const selectedModel = ref(models[0]);
const sourceImage = ref<File | null>(null);
const sourceImageUrl = ref<string | null>(null);
const prompt = ref<string>('');
const canvasRef = ref<HTMLCanvasElement | null>(null);
const isDrawing = ref<boolean>(false);
const loading = ref<boolean>(false);
const generatedImageUrl = ref<string | null>(null);
const imageRef = ref<HTMLImageElement | null>(null);
const drawingHistory = ref<string[]>([]);

onMounted(async () => {

});

const onImageUpload = () => {
    if (sourceImage.value) {
        const reader = new FileReader();
        reader.onload = (e) => {
            sourceImageUrl.value = e.target?.result as string;

            nextTick(() => {
                if (canvasRef.value && imageRef.value) {
                    canvasRef.value.width = imageRef.value.clientWidth;
                    canvasRef.value.height = imageRef.value.clientHeight;
                }
                else {
                    console.error('Canvas element not found');
                }
            });
        };
        reader.readAsDataURL(sourceImage.value);
    }
};

const startDrawing = (event: MouseEvent) => {
    isDrawing.value = true;
    if (!canvasRef.value) return;
    const ctx = canvasRef.value.getContext('2d');
    if (!ctx) return;
    ctx.beginPath();
    const { offsetX, offsetY } = event;
    ctx.moveTo(offsetX, offsetY);

};

const draw = (event: MouseEvent) => {
    if (!isDrawing.value || !canvasRef.value) return;

    const ctx = canvasRef.value.getContext('2d');
    if (!ctx) return;
    ctx.lineWidth = 20;
    ctx.strokeStyle = 'white';

    const { offsetX, offsetY } = event;
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
};

const stopDrawing = () => {
    if (!isDrawing.value || !canvasRef.value) return;
    const ctx = canvasRef.value.getContext('2d');
    if (!ctx) return;

    ctx.closePath();
    drawingHistory.value.push(canvasRef.value.toDataURL());

    isDrawing.value = false;
};

const drawMask = () => {
    const newCanvas = document.createElement('canvas');
    const newContext = newCanvas.getContext('2d');

    if (!newContext || !canvasRef.value) return;
    newCanvas.width = canvasRef.value.width;
    newCanvas.height = canvasRef.value.height;

    newContext.fillStyle = 'black';
    newContext.fillRect(0, 0, newCanvas.width, newCanvas.height);

    newContext.drawImage(canvasRef.value, 0, 0);
    return newCanvas;
}

const drawNaturalMask = () => {
    const canvas = drawMask();
    if (!canvas) return;
    const newCanvas = document.createElement('canvas');
    const newContext = newCanvas.getContext('2d');
    if (!newContext || !imageRef.value) return null;

    const imgElement = imageRef.value;
    const naturalWidth = imgElement.naturalWidth;
    const naturalHeight = imgElement.naturalHeight;

    newCanvas.width = naturalWidth;
    newCanvas.height = naturalHeight;

    newContext.drawImage(
        canvas,
        0, 0, canvas.width, canvas.height,
        0, 0, naturalWidth, naturalHeight
    );

    return newCanvas;
};


const undoLastDraw = () => {
    if (drawingHistory.value.length > 0) {
        drawingHistory.value.pop();
        clearCanvas();
        redrawHistory();
    }
}

const clearCanvas = () => {
    if (!canvasRef.value) return;
    const ctx = canvasRef.value.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height);
}

const redrawHistory = () => {
    if (!canvasRef.value) return;
    const ctx = canvasRef.value.getContext('2d');
    if (!ctx) return;
    if (drawingHistory.value.length === 0) return;
    const dataURL = drawingHistory.value[drawingHistory.value.length - 1];
    const img = new Image();
    img.src = dataURL;
    img.onload = () => {
        ctx.drawImage(img, 0, 0);
    };
}

const clearAll = () => {
    drawingHistory.value = [];
    clearCanvas();
}

const generateImage = async () => {
    const maskCanvas = drawNaturalMask();
    if (!maskCanvas) return;
    if (!selectedModel.value || !sourceImage.value || !prompt.value || !canvasRef.value) {
        return;
    }

    loading.value = true;

    const imageArrayBuffer = await sourceImage.value.arrayBuffer();
    const maskArrayBuffer = await getCanvasArrayBuffer(maskCanvas);
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
                'Content-Type': 'application/json',
                Authorization: `token ${localStorage.getItem('userPassword')}`
            },
            body: JSON.stringify(inputs)
        });

        if (res.ok) {
            const blob = await res.blob();
            generatedImageUrl.value = window.URL.createObjectURL(blob);
        } else if (res.status === 401) {
            authStore.showDialog();
        } else {
            const errorText = await res.text();
            console.error('Error:', res.status, errorText);
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
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    background-color: rgba(0, 0, 0, 0.015);
    border-radius: 8px;
}

.image-container img {
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: 0 auto;
    object-fit: contain;
    border-radius: 8px;
    user-select: none;
}

.drawing-canvas {
    width: 100%;
    height: 100%;
    top: 0;
    position: absolute;
}

canvas {
    pointer-events: all;
}
</style>
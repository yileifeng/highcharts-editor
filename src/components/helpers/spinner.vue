<template>
    <div class="spinner" :style="{ width: size, height: size, borderColor: color }"></div>
</template>

<script setup lang="ts">
defineProps({
    size: {
        type: String,
        default: '16px',
    },
    color: {
        type: String,
        default: '#009cd1',
    },
});
</script>

<style scoped>
.spinner {
    border: 2px solid transparent;
    border-top-color: currentColor;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
</style>
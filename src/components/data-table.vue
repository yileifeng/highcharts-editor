<template>
    <div class=""></div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const props = defineProps({
    uploadedFile: {
        type: File
    },
    pastedFile: {
        type: String
    }
});

onMounted(() => {
    
});
</script>

<style lang="scss"></style>

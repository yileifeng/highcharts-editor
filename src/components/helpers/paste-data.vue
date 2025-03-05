<template>
    <div class="h-full">
        <h3 class="font-bold text-lg">{{ $t('editor.data.paste.label') }}</h3>
        <div class="mt-2">{{ $t('editor.data.paste.description') }}</div>

        <textarea
            class="paste-box border border-black h-2/3 w-full mt-4"
            :placeholder="$t('editor.data.paste.placeholder')"
            v-model="pastedData"
        ></textarea>

        <div class="flex mt-4">
            <button
                class="bg-slate-600 text-white border border-black hover:bg-gray-400 font-bold p-4"
                :class="{ 'disabled hover:bg-gray-400': !pastedData }"
                :disabled="!pastedData"
                @click="
                    () => {
                        emit('import', pastedData);
                        $vfm.close('paste-data');
                    }
                "
            >
                {{ $t('editor.label.import') }}
            </button>
            <button
                class="bg-white border border-black hover:bg-gray-100 font-bold p-4 ml-8"
                @click="$vfm.close('paste-data')"
            >
                {{ $t('editor.label.cancel') }}
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

const emit = defineEmits(['import']);

const props = defineProps({
    pastedData: {
        type: String
    }
});

const pastedData = ref<string>('');

onMounted(() => {
    pastedData.value = props.pastedData || '';
});
</script>
<style lang="scss">
.paste-box {
    height: 200px;
}
</style>

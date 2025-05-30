<template>
    <div id="app" class="app-container">
        <header
            class="editor-header sticky top-0 flex border-b border-black bg-gray-200 py-2 px-2 justify-between z-40"
        >
            <div class="w-mobile-full flex items-center truncate">
                <span class="font-semibold text-lg m-1">{{ $t('editor.title') }}</span>
            </div>

            <button
                @click="changeLang"
                class="bg-white border border-black hover:bg-gray-100 font-bold p-2 ml-auto mr-4"
            >
                {{ appLang === 'en' ? $t('editor.lang.fr') : $t('editor.lang.en') }}
            </button>

            <button
                @click="saveChanges"
                class="bg-black border border-black text-white hover:bg-gray-900 font-bold p-2"
            >
                {{ $t('editor.saveChanges') }}
                <span v-if="saving" class="align-middle inline-block px-1">
                    <VueSpinnerOval size="16px" color="#009cd1" class="ml-1 mb-1"></VueSpinnerOval>
                </span>
            </button>
        </header>

        <div class="items-stretch flex">
            <SideMenu :lang="appLang"></SideMenu>
            <div class="grid-container z-20 w-full flex-grow min-w-0">
                <router-view :key="$route.path" :lang="appLang"></router-view>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { VueSpinnerOval } from 'vue3-spinners';
import { useChartStore } from './stores/chartStore';
import { useI18n } from 'vue-i18n';

import SideMenu from './components/side-menu.vue';

const props = defineProps({
    lang: {
        type: String
    }
});

const emit = defineEmits(['saved']);

const i18n = useI18n();
const chartStore = useChartStore();
const appLang = ref('');
const saving = ref<boolean>(false);

onMounted(() => {
    appLang.value = props.lang || 'en';
    i18n.locale.value = appLang.value;
});

const changeLang = (): void => {
    appLang.value = appLang.value === 'en' ? 'fr' : 'en';
    i18n.locale.value = appLang.value;
};

const saveChanges = (): void => {
    if (Object.keys(chartStore.chartConfig).length) {
        saving.value = true;
        emit('saved', chartStore.chartConfig);
        setTimeout(() => {
            saving.value = false;
        }, 1000);
    }
};
</script>

<style lang="scss">
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
}

.grid-container {
    display: grid;
    grid-template-columns: repeat(1, calc(100%));
}
</style>

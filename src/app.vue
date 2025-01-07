<template>
    <div id="app" class="app-container">
        <header
            class="editor-header sticky top-0 flex border-b border-black bg-gray-200 py-2 px-2 justify-between z-40"
        >
            <div class="w-mobile-full truncate">
                <span class="font-semibold text-lg m-1">{{ $t('editor.title') }}</span>
            </div>

            <!-- TODO: add header buttons - save, change lang-->
            <!-- <button @click="changeLang" class="editor-button bg-black text-white hover:bg-gray-900">
                <span class="inline-block">{{ lang === 'en' ? $t('editor.lang.fr') : $t('editor.lang.en') }}</span>
            </button> -->

            <!-- <button @click="saveChanges" class="editor-button bg-black text-white hover:bg-gray-900">
                <span class="inline-block">{{ $t('editor.saveChanges') }}</span>
                <span v-if="saving" class="align-middle inline-block px-1">
                    <spinner size="16px" color="#009cd1" class="ml-1 mb-1"></spinner>
                </span>
            </button> -->
        </header>

        <div class="items-stretch flex">
            <SideMenu :lang="appLang"></SideMenu>
            <div class="content w-full flex-grow">
                <router-view :key="$route.path"></router-view>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import SideMenu from './components/side-menu.vue';

const props = defineProps({
    lang: {
        type: String
    }
});

const appLang = ref('');

onMounted(() => {
    appLang.value = props.lang || 'en';
});

const changeLang = (): void => {
    appLang.value = appLang.value === 'en' ? 'fr' : 'en';
};

const saveChanges = (): void => {
    // TODO
};
</script>

<style lang="scss">
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
}
</style>

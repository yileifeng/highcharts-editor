import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './app.vue';

import router from './router';
import i18n from './lang';
import './style.css';

import HighchartsVue from 'highcharts-vue';
import Highcharts from 'highcharts';
import VuePapaParse from 'vue-papa-parse';
import VueTippy from 'vue-tippy';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/dist/backdrop.css';

import ColorPicker from 'vue-accessible-color-picker';
import 'vue-accessible-color-picker/styles';

import { createVfm } from 'vue-final-modal';
import 'vue-final-modal/style.css';
const vfm = createVfm();

const app = createApp(App);
const pinia = createPinia();

app.use(pinia)
    .use(router)
    .use(i18n)
    .use(HighchartsVue, { highcharts: Highcharts, tagName: 'highchart' })
    .use(VuePapaParse)
    .use(ColorPicker)
    .use(VueTippy, {
        directive: 'tippy',
        component: 'tippy'
    })
    .use(vfm);

app.provide('$papa', app.config.globalProperties.$papa);

app.mount('#app');

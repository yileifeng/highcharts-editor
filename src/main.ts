import { createApp } from 'vue';
import App from './app.vue';

import router from './router';
import i18n from './lang';
import './style.css';

import VueTippy from 'vue-tippy';
import HighchartsVue from 'highcharts-vue';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/dist/backdrop.css';

const app = createApp(App);

app.use(router).use(i18n).use(HighchartsVue, { tagName: 'charts' }).use(VueTippy, {
    directive: 'tippy',
    component: 'tippy'
});

app.mount('#app');

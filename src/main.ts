import { createApp } from 'vue';
import App from './app.vue';

// import './router/componentHooks';
// import router from './router';
// import { i18n } from './lang';

import VueTippy from 'vue-tippy';
import HighchartsVue from 'highcharts-vue';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/dist/backdrop.css';

const app = createApp(App);

app.use(HighchartsVue, { tagName: 'charts' }).use(VueTippy, {
    directive: 'tippy',
    component: 'tippy'
});

app.mount('#app');

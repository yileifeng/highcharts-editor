import { createRouter, createWebHashHistory } from 'vue-router';
import DataSection from '@/components/data-section.vue';
import ChartSelection from '@/components/chart-selection.vue';
import ConfigCustomization from '@/components/config-customization.vue';

const routes = [
    {
        path: '/',
        component: DataSection
    },
    {
        path: '/data-section',
        name: 'DataSection',
        component: DataSection
    },
    {
        path: '/chart-selection',
        name: 'ChartSelection',
        component: ChartSelection
    },
    {
        path: '/config-customization',
        name: 'ConfigCustomization',
        component: ConfigCustomization
    }
];

const router = createRouter({
    routes: routes,
    history: createWebHashHistory()
});

export default router;

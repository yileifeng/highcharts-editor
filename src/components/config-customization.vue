<template>
    <div class="chart-customization m-6">
        <div class="text-2xl font-bold">{{ $t('editor.customization.title') }}</div>
        <!-- header nav section for customization options -->
        <div class="mt-8 w-1/2">
            <div class="flex justify-around">
                <div
                    v-for="(section, idx) in sections"
                    :key="idx"
                    class="cursor-pointer py-2 px-4 flex-1 text-center"
                    :class="{ 'font-semibold': activeSection === section }"
                    @click="() => (activeSection = section)"
                >
                    {{ $t(`editor.customization.${section}`) }}
                </div>
            </div>
            <!-- nav bar -->
            <div class="flex">
                <div
                    v-for="section in sections"
                    :key="section"
                    class="h-1 flex-1 transition-all"
                    :class="activeSection === section ? 'bg-black' : 'bg-gray-300'"
                ></div>
            </div>
        </div>

        <!-- Configure chart titles -->
        <template v-if="activeSection === 'chartTitles'">
            <titles-customization />
        </template>

        <!-- Customize chart data options -->
        <template v-else-if="activeSection === 'dataSeries'">
            <data-customization />
        </template>

        <!-- Configure chart axes -->
        <template v-else-if="activeSection === 'axes'">
            <axes-customization />
        </template>

        <!-- Custom JSON editor -->
        <template v-else> TODO: add JSON editor + validation </template>

        <!-- Highcharts preview -->
        <div class="font-bold mt-6">{{ $t('editor.preview') }}</div>
        <!-- Preview of chart -->
        <div class="dv-chart-container items-stretch h-full w-full mt-2">
            <highchart :options="chartConfig"></highchart>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useChartStore } from '../stores/chartStore';

import TitlesCustomization from './helpers/titles-customization.vue'
import DataCustomization from './helpers/data-customization.vue'
import AxesCustomization from './helpers/axes-customization.vue'

import Highcharts from 'highcharts';
import dataModule from 'highcharts/modules/data';

dataModule(Highcharts);

const chartStore = useChartStore();
const chartConfig = computed(() => chartStore.chartConfig);

const sections = ['chartTitles', 'dataSeries', 'axes', 'advanced'];
// default to chart titles
const activeSection = ref<string>('chartTitles');
</script>

<style lang="scss">
.dv-chart-container {
    width: 98%;
}
</style>

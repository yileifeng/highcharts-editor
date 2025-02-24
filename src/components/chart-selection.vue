<template>
    <div class="chart-selection m-6">
        <div class="text-2xl font-bold">{{ $t('editor.selection.title') }}</div>
        <div class="font-bold mt-6">{{ $t('editor.selection.template') }}</div>
        <select class="border border-black w-2/3 mt-2 p-2 rounded" v-model="chartType" @change="handleChartSelection()">
            <option v-for="template in Object.keys(chartTemplates)" :key="template" :value="template">
                {{ $t(`editor.selection.${template}`) }}
            </option>
        </select>

        <div v-if="!loading">
            <div class="font-bold mt-6">{{ $t('editor.preview') }}</div>
            <!-- Preview of chart -->
            <div class="dv-chart-container items-stretch h-full w-full mt-2">
                <highchart :options="chartConfig"></highchart>
            </div>
        </div>

        <router-link class="flex items-center mt-4" :to="{ name: 'Customization' }">
            <button class="bg-black text-white border border-black hover:bg-gray-800 font-bold p-4 ml-auto">
                {{ $t('editor.customization.title') }}
            </button>
        </router-link>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { useChartStore } from '../stores/chartStore';
import { useDataStore } from '../stores/dataStore';

import Highcharts from 'highcharts';
import dataModule from 'highcharts/modules/data';

dataModule(Highcharts);

const chartStore = useChartStore();
const chartConfig = computed(() => chartStore.chartConfig);

const dataStore = useDataStore();
const seriesNames = computed(() => Object.values(dataStore.headers).slice(1));

const chartType = ref<string>('');
const chartTemplates: Record<string, string> = {
    bar: 'bar',
    column: 'column',
    line: 'line',
    scatter: 'scatter',
    pie: 'pie'
};

const loading = ref<boolean>(true);
onMounted(() => {
    chartType.value = chartStore.chartType ? chartStore.chartType : 'line';
    handleChartSelection();
});

const handleChartSelection = (): void => {
    switch (chartType.value) {
        case chartTemplates.bar: {
            chartStore.setChartType('bar');
            const categories = dataStore.gridData.map((row) => row[0]);
            const seriesData = dataStore.gridData.map((row) => parseFloat(row[1]));

            chartStore.setupBarChart(seriesNames.value, categories, seriesData);
            break;
        }
        case chartTemplates.column: {
            chartStore.setChartType('column');
            const categories = dataStore.gridData.map((row) => row[0]);
            const seriesData = dataStore.gridData.map((row) => parseFloat(row[1]));

            chartStore.setupColumnChart(seriesNames.value, categories, seriesData);
            break;
        }
        case chartTemplates.line: {
            chartStore.setChartType('line');
            const categories = dataStore.gridData.map((row) => row[0]);
            const seriesData = dataStore.gridData.map((row) => parseFloat(row[1]));

            chartStore.setupLineChart(seriesNames.value, categories, seriesData);
            break;
        }
        case chartTemplates.scatter: {
            chartStore.setChartType('scatter');
            // check if there exist categories (string values as first col) or if data is formatted as points in (x, y)
            const firstColNumeric = dataStore.gridData.every((row) => !isNaN(parseFloat(row[0])));
            if (firstColNumeric) {
                const seriesData = dataStore.gridData.map((row) => ({
                    x: parseFloat(row[0]),
                    y: parseFloat(row[1])
                }));
                chartStore.setupScatterPlot(seriesNames.value, seriesData);
            } else {
                const categories = dataStore.gridData.map((row) => row[0]);
                const seriesData = dataStore.gridData.map((row) => parseFloat(row[1]));
                chartStore.setupScatterPlot(seriesNames.value, seriesData, categories);
            }

            break;
        }
        case chartTemplates.pie: {
            chartStore.setChartType('pie');
            const data = dataStore.gridData.map((row) => ({
                name: row[0],
                y: parseFloat(row[1])
            }));

            chartStore.setupPieChart(seriesNames.value, data);
            break;
        }
    }
    loading.value = false;
};
</script>

<style lang="scss"></style>

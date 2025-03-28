<template>
    <div class="chart-customization-title">
        <div class="mt-6">{{ $t('editor.customization.dataSeries') }}</div>
        <div class="relative w-1/5 mt-2">
            <select
                class="border border-black w-full p-2 rounded appearance-none cursor-pointer"
                v-model="activeDataSeries"
            >
                <!-- Enable insert when exactly one row is selected, enable delete when any number of rows are selected -->
                <option v-for="series in Object.values(headers.slice(1))" :key="series" :value="series">
                    {{ series }}
                </option>
            </select>
            <div class="select-arrow absolute right-2 top-1/2"></div>
        </div>

        <h2 class="font-bold mt-6">{{ $t('editor.customization.data.format') }}</h2>
        <div class="mt-4">{{ $t('editor.customization.data.seriesType') }}</div>
        <div class="relative w-1/6 mt-2">
            <select class="border border-black w-full p-2 rounded appearance-none cursor-pointer" v-model="chartType">
                <option v-for="series in Object.keys(seriesOptions)" :key="series" :value="series">
                    {{ $t(`editor.customization.data.series.${series}`) }}
                </option>
            </select>
            <div class="select-arrow absolute right-2 top-1/2"></div>
        </div>

        <div v-if="chartType !== 'pie'">
            <div class="mt-4">{{ $t('editor.customization.data.colour') }}</div>
            <div class="flex flex-col w-1/6 mt-2">
                <div
                    class="colour-dropdown w-full rounded border border-gray-500 flex items-center justify-between cursor-pointer"
                    @click="() => (showColourPicker = !showColourPicker)"
                    @keypress.enter="() => (showColourPicker = !showColourPicker)"
                    tabindex="0"
                >
                    <div class="flex w-full h-full">
                        <div
                            class="rounded border-r border-gray-400 w-10"
                            tabindex="0"
                            :style="{ 'background-color': (activeSeries as SeriesData).color }"
                        ></div>
                        <div class="flex items-center px-3">{{ (activeSeries as SeriesData).color }}</div>
                        <div class="flex items-center justify-center pr-2 ml-auto">
                            <span class="select-arrow"></span>
                        </div>
                    </div>
                </div>
                <div
                    v-if="showColourPicker"
                    class="w-full items-center justify-center border border-gray-300 rounded-md p-2 shadow-sm"
                >
                    <ColorPicker
                        :color="(activeSeries as SeriesData).color"
                        alpha-channel="hide"
                        :visible-formats="['hex']"
                        default-format="hex"
                        @color-change="updateColour"
                    >
                        <template #copy-button></template>
                    </ColorPicker>
                </div>
            </div>

            <div class="mt-4">{{ $t('editor.customization.data.dashStyle') }}</div>
            <div class="relative w-1/6 mt-2">
                <select
                    class="border border-black w-full p-2 rounded appearance-none cursor-pointer"
                    v-model="(activeSeries as SeriesData).dashStyle"
                >
                    <option v-for="dashStyle in Object.keys(dashOptions)" :key="dashStyle" :value="dashStyle">
                        {{ $t(`editor.customization.data.${dashStyle}`) }}
                    </option>
                </select>
                <div class="select-arrow absolute right-2 top-1/2"></div>
            </div>

            <div class="mt-4">{{ $t('editor.customization.data.pointMarker') }}</div>
            <div class="relative w-1/6 mt-2">
                <select
                    class="border border-black w-full p-2 rounded appearance-none cursor-pointer"
                    v-model="(activeSeries as SeriesData).marker!.symbol"
                >
                    <option v-for="pointMarker in Object.keys(markerOptions)" :key="pointMarker" :value="pointMarker">
                        {{ $t(`editor.customization.data.${pointMarker}`) }}
                    </option>
                </select>
                <div class="select-arrow absolute right-2 top-1/2"></div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, ref } from 'vue';
import { useChartStore } from '../../stores/chartStore';
import { useDataStore } from '../../stores/dataStore';
import { SeriesData } from '../../definitions';

const chartStore = useChartStore();
const chartConfig = computed(() => chartStore.chartConfig);
const defaultChartType = computed(() => chartStore.chartType);
const dataStore = useDataStore();

const headers = computed(() => dataStore.headers);
const activeDataSeries = ref<string>('');
const activeSeries = computed(() => {
    if (Array.isArray(chartConfig.value.series)) {
        return chartConfig.value.series.find((s) => s.name === activeDataSeries.value);
    } else {
        return chartConfig.value.series;
    }
});
const chartType = ref<string>('');
const showColourPicker = ref<boolean>(false);
// const dataColour = ref<string>('#1f2937');
// const dataDashStyle = ref<string>('solid');
// const dataPointMarker = ref<string>('circle');

const seriesOptions: Record<string, string> = {
    bar: 'bar',
    column: 'column',
    line: 'line',
    scatter: 'scatter',
    pie: 'pie'
};

const dashOptions: Record<string, string> = {
    dotted: 'dotted',
    dashed: 'dashed',
    solid: 'solid'
};

const markerOptions: Record<string, string> = {
    square: 'square',
    circle: 'circle',
    triangle: 'triangle'
};

onBeforeMount(() => {
    activeDataSeries.value = Object.values(headers.value)[1];
    chartType.value = defaultChartType.value;
});

const updateColour = (eventData: any) => {
    (activeSeries.value as SeriesData).color = eventData.cssColor;
};
</script>

<style scoped lang="scss">
:deep(.vacp-color-inputs),
:deep(.vacp-copy-button),
:deep(.vacp-range-input-label-text--hue) {
    display: none;
}

.colour-dropdown {
    height: 40px;
}

.select-arrow {
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 6px solid black; /* Standard dropdown arrow */
}

select {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background: none; /* Remove default background */
}
</style>

<template>
    <div class="chart-customization m-6">
        <div class="text-2xl font-bold">{{ $t('editor.customization.title') }}</div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { useChartStore } from '../stores/chartStore';
import { useDataStore } from '../stores/dataStore';

import Highcharts from 'highcharts';
import dataModule from 'highcharts/modules/data';

dataModule(Highcharts);

</script>

<style lang="scss">
.dv-chart-container {
    width: 98%;
}
</style>
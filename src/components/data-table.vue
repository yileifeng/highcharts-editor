<template>
    <div>
        <div class="mt-4">{{ $t('editor.data.modify') }}</div>
        <div class="flex mt-4">
            <button
                class="bg-black text-white border border-black hover:bg-gray-800 font-bold p-2"
                @click="emit('back')"
            >
                {{ $t('editor.datatable.uploadNew') }}
            </button>

            <!-- Row and column actions -->
            <div class="ml-auto">
                <select
                    class="border border-black mr-4 p-2 rounded bg-gray-300 focus:bg-white"
                    v-model="rowAction"
                    @change="handleRowAction()"
                >
                    <option value="" hidden>{{ $t('editor.datatable.rowActions') }}</option>
                    <!-- Enable insert when exactly one row is selected, enable delete when any number of rows are selected -->
                    <option
                        v-for="action in Object.keys(rowActions)"
                        :key="action"
                        :value="action"
                        :disabled="
                            action === 'delete'
                                ? !Object.values(selectedRows).some((row) => row)
                                : !(Object.values(selectedRows).filter((row) => row).length === 1)
                        "
                    >
                        {{ $t(`editor.datatable.rowActions.${action}`) }}
                    </option>
                </select>

                <select
                    class="border border-black p-2 rounded bg-gray-300 focus:bg-white"
                    v-model="colAction"
                    @change="handleColAction()"
                >
                    <option value="" hidden>{{ $t('editor.datatable.colActions') }}</option>
                    <!-- Enable insert when exactly one col is selected, enable delete when any number of cols are selected -->
                    <option
                        v-for="action in Object.keys(colActions)"
                        :key="action"
                        :value="action"
                        :disabled="
                            action === 'delete'
                                ? !Object.values(selectedCols).some((col) => col)
                                : !(Object.values(selectedCols).filter((col) => col).length === 1)
                        "
                    >
                        {{ $t(`editor.datatable.colActions.${action}`) }}
                    </option>
                </select>
            </div>
        </div>

        <!-- Datatable -->
        <div class="overflow-x-auto">
            <table class="table-auto border-collapse border border-black w-full mt-8" border="1">
                <thead>
                    <tr class="bg-gray-200">
                        <th class="border border-gray-400 p-2 text-left align-middle"></th>
                        <th
                            class="border border-gray-400 p-2 text-left align-middle"
                            v-for="(header, colIdx) in headers"
                            :key="colIdx"
                        >
                            <span class="col-header" v-if="editingHeader !== colIdx" @click="editColHeader(colIdx)">
                                {{ header }}
                            </span>
                            <input
                                v-else
                                class="col-header border border-black"
                                type="text"
                                v-model="headers[colIdx]"
                                @blur="escEditCell"
                                @keyup.enter="escEditCell"
                            />
                            <input class="ml-2" type="checkbox" v-model="selectedCols[colIdx]" />
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="even:bg-gray-50" v-for="(row, rowIdx) in gridData" :key="rowIdx">
                        <td class="border border-gray-400 p-2 text-left">
                            <input type="checkbox" v-model="selectedRows[rowIdx]" />
                        </td>
                        <td
                            class="border border-gray-400 p-2 text-left align-middle"
                            v-for="(value, colIdx) in row"
                            :key="colIdx"
                        >
                            <span
                                class="grid-cell"
                                v-if="editingCell.rowIdx !== rowIdx || editingCell.colIdx !== colIdx"
                                @click="editCell(rowIdx, colIdx, value)"
                            >
                                {{ value }}
                            </span>
                            <input
                                v-else
                                class="grid-cell border border-black w-full"
                                type="text"
                                v-model="editingVal"
                                @input="updateCell(rowIdx, colIdx, ($event.target as HTMLInputElement).value)"
                                @blur="escEditCell"
                                @keyup.enter="escEditCell"
                            />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="font-bold mt-8">{{ $t('editor.preview') }}</div>
        <!-- Preview of chart -->
        <div class="dv-chart-container items-stretch h-full w-full mt-2">
            <highchart :options="chartConfig"></highchart>
        </div>

        <router-link class="flex items-center mt-4" :to="{ name: 'ChartType' }">
            <button class="bg-black text-white border border-black hover:bg-gray-800 font-bold p-4 ml-auto">
                {{ $t('editor.datatable.templates') }}
            </button>
        </router-link>
    </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, inject, onBeforeUnmount, onMounted } from 'vue';
import { useDataStore } from '../stores/dataStore';
import { useChartStore } from '../stores/chartStore';

import Highcharts from 'highcharts';
import dataModule from 'highcharts/modules/data';

dataModule(Highcharts);

const props = defineProps({
    uploadedFile: {
        type: File
    },
    pastedFile: {
        type: String
    }
});

const emit = defineEmits(['back']);

const $papa: any = inject('$papa');
const dataStore = useDataStore();
const chartStore = useChartStore();

const headers = computed(() => dataStore.headers);
const gridData = computed(() => dataStore.gridData);
const chartConfig = computed(() => chartStore.chartConfig);

const editingHeader = ref(-1);
const editingCell = ref({ rowIdx: -1, colIdx: -1 });
const editingVal = ref('');

let selectedRows = reactive({});
let selectedCols = reactive({});
const rowAction = ref<string>('');
const colAction = ref<string>('');

const rowActions: Record<string, string> = {
    delete: 'delete',
    insertAbove: 'insertAbove',
    insertBelow: 'insertBelow'
};

const colActions: Record<string, string> = {
    delete: 'delete',
    insertLeft: 'insertLeft',
    insertRight: 'insertRight'
};

onMounted(() => {
    if (gridData && gridData.value.length) {
        return;
    } else if (props.uploadedFile) {
        const file = props.uploadedFile;
        // parse uploaded file
        $papa.parse(file, {
            header: true, // first row headers
            skipEmptyLines: true,
            complete: (res) => {
                dataStore.setHeaders(res.meta.fields || []);
                dataStore.setGridData(res.data.map((row) => dataStore.headers.map((header) => row[header])));

                // default preview of datatable to line graph
                const categories = dataStore.gridData.map((row) => row[0]);
                const seriesData = dataStore.gridData.map((row) => parseFloat(row[1]));
                chartStore.setupLineChart(Object.values(dataStore.headers).slice(1), categories, seriesData);
            },
            error: (err) => {
                console.error('Error parsing file: ', err);
            }
        });
    } else {
        // TODO - handle pasted data
    }

    document.addEventListener('click', handleMouseClick);
});

onBeforeUnmount(() => {
    document.removeEventListener('click', handleMouseClick);
});

// turn off grid edit inputs on mouse click
const handleMouseClick = (event: MouseEvent): void => {
    const target = event.target as HTMLElement;
    // ignore if clicking on a grid cell element
    if (target.closest('.grid-cell') || target.closest('.col-header')) {
        return;
    } else {
        escEditCell();
    }
};

const editColHeader = (colIdx: number) => {
    editingHeader.value = colIdx;
};

const editCell = (rowIdx: number, colIdx: number, val: string) => {
    editingCell.value = { rowIdx: rowIdx, colIdx: colIdx };
    editingVal.value = val;
};

const escEditCell = () => {
    editingHeader.value = -1;
    editingCell.value = { rowIdx: -1, colIdx: -1 };
    editingVal.value = '';
};

const updateCell = (rowIdx: number, colIdx: number, val: string) => {
    dataStore.updateCell(rowIdx, colIdx, val);
};

const handleRowAction = (): void => {
    const rowIdxs = Object.keys(selectedRows).filter((idx) => selectedRows[idx]);
    switch (rowAction.value) {
        case rowActions.delete: {
            dataStore.deleteRows(rowIdxs);
            break;
        }
        case rowActions.insertBelow: {
            dataStore.addNewRow(rowIdxs[0], true);
            break;
        }
        case rowActions.insertAbove: {
            dataStore.addNewRow(rowIdxs[0], false);
            break;
        }
    }

    // clear row action selection
    selectedRows = reactive({});
    rowAction.value = '';
};

const handleColAction = (): void => {
    const colIdxs = Object.keys(selectedCols).filter((idx) => selectedCols[idx]);
    switch (colAction.value) {
        case colActions.delete: {
            dataStore.deleteCols(colIdxs);
            break;
        }
        case colActions.insertRight: {
            dataStore.addNewCol(colIdxs[0], true);
            break;
        }
        case colActions.insertLeft: {
            dataStore.addNewCol(colIdxs[0], false);
            break;
        }
    }

    // clear col action selection
    selectedCols = reactive({});
    colAction.value = '';
};
</script>

<style lang="scss"></style>

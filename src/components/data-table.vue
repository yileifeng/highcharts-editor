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
                            <input type="checkbox" v-model="selectedCols[colIdx]" />
                            {{ header }}
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
                            {{ value }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref, inject, onMounted } from 'vue';

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

const headers = ref<string[]>([]);
const gridData = ref<any[]>([]);

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
    if (props.uploadedFile) {
        const file = props.uploadedFile;
        // parse uploaded file
        $papa.parse(file, {
            header: true, // first row headers
            skipEmptyLines: true,
            complete: (res) => {
                headers.value = res.meta.fields || [];
                gridData.value = res.data.map(row => headers.value.map(header => row[header]));
            },
            error: (err) => {
                console.error('Error parsing file: ', err);
            }
        });
    } else {
        // TODO - handle pasted data
    }
});

const handleRowAction = (): void => {
    const rowIdxs = Object.keys(selectedRows).filter((idx) => selectedRows[idx]);
    switch (rowAction.value) {
        case rowActions.delete: {
            deleteRows(rowIdxs);
            break;
        }
        case rowActions.insertBelow: {
            addNewRow(rowIdxs[0], true);
            break;
        }
        case rowActions.insertAbove: {
            addNewRow(rowIdxs[0], false);
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
            deleteCols(colIdxs);
            break;
        }
        case colActions.insertRight: {
            addNewCol(colIdxs[0], true);
            break;
        }
        case colActions.insertLeft: {
            addNewCol(colIdxs[0], false);
            break;
        }
    }

    // clear col action selection
    selectedCols = reactive({});
    colAction.value = '';
};

const deleteRows = (selectedRowIdxs: string[]): void => {
    gridData.value = gridData.value.filter((_, idx) => !selectedRowIdxs.includes(idx.toString()));
};

const addNewRow = (selectedRowIdx: string, below: boolean = true): void => {
    const newRow = headers.value.map(() => '');
    const newIdx = parseInt(selectedRowIdx);
    // add empty row based on insert above/below
    if (below) {
        gridData.value.splice(newIdx + 1, 0, newRow);
    } else {
        gridData.value.splice(newIdx, 0, newRow);
    }
};

const deleteCols = (selectedColIdxs: string[]): void => {
    // sort indices in descending to avoid issues with shifting
    const selectedIdxs = selectedColIdxs.map((idx: string) => parseInt(idx)).sort().reverse();

    // for each col delete its header and all col values from grid
    selectedIdxs.forEach(idx => {
        headers.value.splice(idx, 1);
    });
    gridData.value.forEach(row => {
        selectedIdxs.forEach(idx => {
            row.splice(idx, 1);
        });
    });
};

const addNewCol = (selectedColIdx: string, right: boolean = true): void => {
    const newCol = '';
    // determine new position based on insert right/left
    const newIdx = right ? selectedColIdx + 1 : selectedColIdx;
    // add new header and empty col of values
    headers.value.splice(parseInt(newIdx), 0, newCol); 
    gridData.value.forEach((row) => {
        row.splice(newIdx, 0, '');
    });
};
</script>

<style lang="scss"></style>

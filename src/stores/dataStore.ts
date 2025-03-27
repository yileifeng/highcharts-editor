import { defineStore } from 'pinia';

export const useDataStore = defineStore('chartData', {
    state: () => ({
        headers: [] as string[],
        gridData: [] as string[][],
        uploaded: false,
        datatableView: false
    }),
    actions: {
        /* Initially set column headers **/
        setHeaders(headers: string[]) {
            this.headers = headers;
        },
        /* Initially set grid data when uploaded new file **/
        setGridData(data: string[][]) {
            this.gridData = data;
        },
        /* **/
        setDatatableView(datatableView: boolean) {
            this.datatableView = datatableView;
        },
        /* Set flag if user has uploaded valid chart data format **/
        toggleUploaded(uploaded: boolean) {
            this.uploaded = uploaded;
        },
        /* Update cell value in grid data **/
        updateCell(row: number, col: number, value: string) {
            if (this.gridData[row]) {
                this.gridData[row][col] = value;
            }
        },
        /* Delete row(s) from grid data **/
        deleteRows(selectedRowIdxs: string[]) {
            this.gridData = this.gridData.filter((_, idx) => !selectedRowIdxs.includes(idx.toString()));
        },
        /* Add new row to grid data **/
        addNewRow(selectedRowIdx: string, below: boolean = true) {
            const newRow = this.headers.map(() => '');
            const newIdx = parseInt(selectedRowIdx);
            // add empty row based on insert above/below
            if (below) {
                this.gridData.splice(newIdx + 1, 0, newRow);
            } else {
                this.gridData.splice(newIdx, 0, newRow);
            }
        },
        /* Delete column(s) from grid data **/
        deleteCols(selectedColIdxs: string[]) {
            // sort indices in descending to avoid issues with shifting
            const selectedIdxs = selectedColIdxs.map((idx: string) => parseInt(idx)).sort().reverse();
        
            // for each col delete its header and all col values from grid
            selectedIdxs.forEach(idx => {
                this.headers.splice(idx, 1);
            });
            this.gridData.forEach(row => {
                selectedIdxs.forEach(idx => {
                    row.splice(idx, 1);
                });
            });
        },
        /* Add new column to grid data **/
        addNewCol(selectedColIdx: string, right: boolean = true) {
            const newCol = '';
            // determine new position based on insert right/left
            const newIdx = right ? selectedColIdx + 1 : selectedColIdx;
            // add new header and empty col of values
            this.headers.splice(parseInt(newIdx), 0, newCol); 
            this.gridData.forEach((row) => {
                row.splice(newIdx, 0, '');
            });
        }
    }
});

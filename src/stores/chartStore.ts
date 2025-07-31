import { defineStore } from 'pinia';
import { ExportMenuOptions, HighchartsConfig, SeriesData } from '../definitions';

const chartTemplates: Record<string, string> = {
    area: 'area',
    bar: 'bar',
    column: 'column',
    line: 'line',
    pie: 'pie',
    scatter: 'scatter',
    spline: 'spline'
};

export const useChartStore = defineStore('chartProperties', {
    state: () => ({
        chartType: 'line' as string,
        refreshKey: 0 as number,
        highchartType: 'normal' as string,
        defaultTitle: '' as string,
        chartConfig: {} as HighchartsConfig,
        hybridChartType: '' as string,
        chartSeries: [] as string[],
        selectedHybridSeries: [] as string[],
        defaultColours: [
            '#2caffe',
            '#544fc5',
            '#00e272',
            '#fe6a35',
            '#6b8abc',
            '#d568fb',
            '#2ee0ca',
            '#fa4b42',
            '#feb56a',
            '#91e8e1'
        ]
    }),

    actions: {
        /* Reset store to initial state **/
        resetStore(): void {
            this.chartType = 'line';
            this.highchartType = 'normal';
            this.defaultTitle = '';
            this.hybridChartType = '';
            this.chartSeries = [];
            this.chartConfig = {} as HighchartsConfig;
            this.selectedHybridSeries = [];
            this.defaultColours = [
                '#2caffe',
                '#544fc5',
                '#00e272',
                '#fe6a35',
                '#6b8abc',
                '#d568fb',
                '#2ee0ca',
                '#fa4b42',
                '#feb56a',
                '#91e8e1'
            ];
        },

        /* Set highcharts type **/
        setChartType(chartType: string): void {
            this.chartType = chartType;
        },

        /* Set hybrid highcharts type **/
        setHybridChartType(chartType: string): void {
            this.hybridChartType = chartType;
        },

        /* Set default title for highcharts **/
        setDefaultTitle(title: string): void {
            this.defaultTitle = title;
        },

        /* Clear highcharts config **/
        clearChartConfig(): void {
            this.chartConfig = {};
        },

        /* Set context/export menu strings **/
        setMenuOptions(menuOptions: ExportMenuOptions): void {
            this.chartConfig.lang = menuOptions;
        },

        /* Set highcharts config (from imported json file) **/
        setChartConfig(chartConfig: HighchartsConfig): void {
            // add mandatory fields blank (for customization section)
            // TODO: tons of edge cases here depending on the complexity of a chart configuration
            this.chartConfig = {
                ...chartConfig,
                title: {
                    text: chartConfig.title?.text || ''
                },
                subtitle: {
                    text: chartConfig.subtitle?.text || ''
                },
                xAxis: {
                    ...chartConfig.xAxis,
                    categories: Array.isArray(chartConfig.xAxis?.categories)
                        ? chartConfig.xAxis.categories
                        : new Array(chartConfig.series?.[0]?.data?.length || 0).fill(''),
                    title: {
                        text: chartConfig.xAxis?.title?.text || ''
                    }
                },
                yAxis: Array.isArray(chartConfig.yAxis)
                    ? chartConfig.yAxis
                    : {
                          ...chartConfig.yAxis,
                          title: {
                              text: chartConfig.yAxis?.title?.text || ''
                          }
                      },
                series: ((chartConfig.series as SeriesData[]) || []).map((series) => ({
                    ...series,
                    type: series.type || '',
                    color: series.color || '',
                    dashStyle: series.dashStyle || '',
                    marker: {
                        ...series.marker,
                        symbol: series.marker?.symbol || ''
                    }
                }))
            };
        },

        /* Set default highcharts config **/
        setupConfig(seriesNames: string[], cats: string[], seriesData: number[][], categoryLabel = ''): void {
            this.chartConfig = {
                title: {
                    text: ''
                },
                subtitle: {
                    text: ''
                },
                xAxis: {
                    categories: cats,
                    title: {
                        text: categoryLabel
                    }
                },
                yAxis: {
                    title: {
                        text: ''
                    }
                },
                series: seriesNames.map((name, index) => ({
                    name,
                    type: 'line',
                    color: this.defaultColours[index],
                    dashStyle: 'solid',
                    marker: {
                        symbol: 'circle'
                    },
                    data: seriesData[index]
                }))
            };
            this.setChartType('line');
            this.highchartType = 'normal';
        },

        setupTemporalConfig(seriesData: [number, number][]): void {
            this.chartConfig = {
                chart: {
                    zoomType: 'x'
                },
                title: {
                    text: ''
                },
                subtitle: {
                    text: ''
                },
                rangeSelector: {
                    selected: 1,
                    buttons: [
                        {
                            type: 'month',
                            count: 1,
                            text: '1m'
                        },
                        {
                            type: 'month',
                            count: 3,
                            text: '3m'
                        },
                        {
                            type: 'month',
                            count: 6,
                            text: '6m'
                        },
                        {
                            type: 'ytd',
                            text: 'YTD'
                        },
                        {
                            type: 'all',
                            text: 'All'
                        }
                    ]
                },
                xAxis: {
                    type: 'datetime',
                    title: {
                        text: ''
                    }
                },
                yAxis: {
                    title: {
                        text: ''
                    }
                },
                series: [
                    {
                        type: 'line',
                        data: seriesData,
                        tooltip: {
                            valueDecimals: 2
                        }
                    }
                ],
                tooltip: {
                    xDateFormat: '%Y-%m-%d'
                }
            };
            this.setChartType('line');
            this.highchartType = 'stock';
        },

        /* Update highcharts configuration for chart type **/
        updateConfig(
            type: string,
            series: string[],
            headers: string[],
            gridData: string[][],
            selectedSeries?: string,
            currentColours?: string[]
        ): void {
            this.chartConfig.tooltip = {};
            switch (type) {
                case chartTemplates.area: {
                    this.setChartType('area');
                    const seriesData = headers
                        .slice(1)
                        .map((_, colIdx) => gridData.map((row) => parseFloat(row[colIdx + 1])));

                    this.updateAreaChart(series, seriesData);
                    break;
                }
                case chartTemplates.bar: {
                    this.setChartType('bar');
                    const seriesData = headers
                        .slice(1)
                        .map((_, colIdx) => gridData.map((row) => parseFloat(row[colIdx + 1])));

                    this.updateBarChart(series, seriesData);
                    break;
                }
                case chartTemplates.column: {
                    this.setChartType('column');
                    const seriesData = headers
                        .slice(1)
                        .map((_, colIdx) => gridData.map((row) => parseFloat(row[colIdx + 1])));

                    this.updateColumnChart(series, seriesData);
                    break;
                }
                case chartTemplates.line: {
                    this.setChartType('line');
                    const seriesData = headers
                        .slice(1)
                        .map((_, colIdx) => gridData.map((row) => parseFloat(row[colIdx + 1])));

                    this.updateLineChart(series, seriesData);
                    break;
                }
                case chartTemplates.scatter: {
                    this.setChartType('scatter');
                    // TODO (if need to support coords format data):
                    // check if there exist categories (string values as first col) or if data is formatted as points in (x, y)
                    // const firstColNumeric = gridData.every((row) => !isNaN(parseFloat(row[0])));
                    // if (firstColNumeric && headers.length === 2) {
                    //     const seriesData = gridData.map((row) => ({
                    //         x: parseFloat(row[0]),
                    //         y: parseFloat(row[1])
                    //     }));
                    //     const seriesNames = Object.values(headers).slice(1);
                    //     this.updateScatterPlot(seriesNames, seriesData);
                    const seriesData = headers
                        .slice(1)
                        .map((_, colIdx) => gridData.map((row) => parseFloat(row[colIdx + 1])));
                    this.updateScatterPlot(series, seriesData);

                    break;
                }
                case chartTemplates.spline: {
                    this.setChartType('spline');
                    const seriesData = headers
                        .slice(1)
                        .map((_, colIdx) => gridData.map((row) => parseFloat(row[colIdx + 1])));

                    this.updateSplineChart(series, seriesData);
                    break;
                }
                case chartTemplates.pie: {
                    this.setChartType('pie');
                    const selectedSeriesIndex = headers.indexOf(selectedSeries || series[0]);
                    const data = gridData.map((row) => ({
                        name: row[0],
                        y: parseFloat(row[selectedSeriesIndex])
                    }));
                    const colours = currentColours && currentColours.length > 0 ? currentColours : undefined;
                    const seriesNames = Object.values(headers).slice(1);
                    this.updatePieChart(seriesNames, selectedSeriesIndex - 1, data, colours);
                    break;
                }
            }
        },

        /* Update data series after deleting row(s) **/
        deleteRow(rowIdxs: number[]): void {
            const sortedRowIdxs = [...rowIdxs].sort((a, b) => b - a);
            // assuming all indices are valid
            sortedRowIdxs.forEach((rowIdx: number) => {
                this.chartConfig.xAxis.categories.splice(rowIdx, 1);
                this.chartConfig.series.forEach((series: SeriesData) => {
                    series.data?.splice(rowIdx, 1);
                });
            });
        },

        /* Update data series after deleting column(s) **/
        deleteColumn(colIdxs: number[]): void {
            const sortedColIdxs = [...colIdxs].sort((a, b) => b - a);
            sortedColIdxs.forEach((colIdx: number) => {
                this.chartConfig.series.splice(colIdx - 1, 1);
            });
        },

        /* Update data series after inserting row **/
        insertRow(rowIdx: number): void {
            this.chartConfig.xAxis.categories.splice(rowIdx, 0, '');
            this.chartConfig.series.forEach((series: SeriesData) => {
                series.data?.splice(rowIdx, 0, 0);
            });
        },

        /* Update data series after inserting column **/
        insertColumn(colIdx: number): void {
            const defaultData = new Array(this.chartConfig.xAxis.categories.length).fill(0);
            const newSeries: SeriesData = {
                name: 'Untitled',
                type: this.chartType,
                data: defaultData
            };
            (this.chartConfig.series as SeriesData[]).splice(colIdx - 1, 0, newSeries);
        },

        /* Update header (series names) value **/
        updateHeader(colIdx: number, name: string): void {
            if (colIdx === 0) {
                this.chartConfig.xAxis.title.text = name;
            } else {
                (this.chartConfig.series as SeriesData[])[colIdx - 1].name = name;
            }
        },

        /* Update a single series value after data grid cell has been modified **/
        updateVal(rowIdx: number, colIdx: number, val: string): void {
            if (colIdx) {
                this.chartConfig.series[colIdx - 1].data[rowIdx] = parseInt(val);
            } else {
                this.chartConfig.xAxis.categories[rowIdx] = val;
            }
        },

        /* Update highcharts configuration for line chart **/
        updateLineChart(seriesNames: string[], seriesData: number[][]): void {
            this.chartConfig.series = this.chartConfig.series.map((series, index) =>
                seriesNames.includes(series.name)
                    ? {
                          name: series.name,
                          type: 'line',
                          color: this.defaultColours[index],
                          dashStyle: 'solid',
                          marker: { symbol: 'circle' },
                          data: seriesData[index]
                      }
                    : series
            );
            this.chartConfig.legend = { enabled: true };
        },

        /* Update highcharts configuration for bar chart **/
        updateBarChart(seriesNames: string[], seriesData: number[][]): void {
            this.chartConfig.series = this.chartConfig.series.map((series, index) =>
                seriesNames.includes(series.name)
                    ? {
                          name: series.name,
                          type: 'bar',
                          color: this.defaultColours[index],
                          dashStyle: 'solid',
                          marker: {
                              symbol: 'circle'
                          },
                          data: seriesData[index]
                      }
                    : series
            );
            this.chartConfig.legend = { enabled: true };
        },

        /* Update highcharts configuration for scatter plot **/
        updateScatterPlot(seriesNames: string[], seriesData: { x: number; y: number }[] | number[][]): void {
            this.chartConfig.series = this.chartConfig.series.map((series, index) =>
                seriesNames.includes(series.name)
                    ? {
                          name: series.name,
                          type: 'scatter',
                          color: this.defaultColours[index],
                          dashStyle: 'solid',
                          marker: { symbol: 'circle' },
                          data: seriesData[index]
                      }
                    : series
            );
            this.chartConfig.legend = { enabled: true };
            // customize tooltip
            this.chartConfig.tooltip = {
                useHTML: true,
                headerFormat: '<span style="font-size: 10px">{point.key}</span><table>',
                pointFormat:
                    '<tr><td><span style="color:{series.color}">\u25CF</span> {series.name}: </td>' +
                    '<td style="text-align: right"><b> {point.y}</b></td></tr>',
                footerFormat: '</table>'
            };
        },

        /* Update highcharts configuration for column chart **/
        updateColumnChart(seriesNames: string[], seriesData: number[][]): void {
            this.chartConfig.series = this.chartConfig.series.map((series, index) =>
                seriesNames.includes(series.name)
                    ? {
                          name: series.name,
                          type: 'column',
                          color: this.defaultColours[index],
                          dashStyle: 'solid',
                          marker: {
                              symbol: 'circle'
                          },
                          data: seriesData[index]
                      }
                    : series
            );
            this.chartConfig.legend = { enabled: true };
        },

        /* Update highcharts configuration for area chart **/
        updateAreaChart(seriesNames: string[], seriesData: number[][]): void {
            this.chartConfig.series = this.chartConfig.series.map((series, index) =>
                seriesNames.includes(series.name)
                    ? {
                          name: series.name,
                          type: 'area',
                          color: this.defaultColours[index],
                          dashStyle: 'solid',
                          marker: { symbol: 'circle' },
                          data: seriesData[index]
                      }
                    : series
            );
            this.chartConfig.legend = { enabled: true };
        },

        /* Update highcharts configuration for spline chart **/
        updateSplineChart(seriesNames: string[], seriesData: number[][]): void {
            this.chartConfig.series = this.chartConfig.series.map((series, index) =>
                seriesNames.includes(series.name)
                    ? {
                          name: series.name,
                          type: 'spline',
                          color: this.defaultColours[index],
                          dashStyle: 'solid',
                          marker: { symbol: 'circle' },
                          data: seriesData[index]
                      }
                    : series
            );
            this.chartConfig.legend = { enabled: true };
        },

        /* Update highcharts configuration for pie chart **/
        updatePieChart(
            seriesNames: string[],
            seriesIndex: number,
            seriesData: { name: string; y: number }[],
            currentColours?: string[]
        ): void {
            // following would support pie chart as part of hybrid charts
            // this.chartConfig.series = this.chartConfig.series.map((series, index) =>
            //     seriesNames.includes(series.name) ? { name: seriesNames[0], type: 'pie', data: seriesData[index] } : series
            // );

            this.chartConfig.series = this.chartConfig.series.map((series, index) => {
                if (index === seriesIndex) {
                    return {
                        name: seriesNames[seriesIndex],
                        type: 'pie',
                        data: seriesData,
                        colors: currentColours || this.defaultColours.slice(0, seriesData.length)
                    };
                } else {
                    return {
                        ...series,
                        data: [],
                        type: 'pie',
                        visible: false
                    };
                }
            });

            this.chartConfig.legend = { enabled: false };
        },

        /* Update highcharts configuration for hybrid chart **/
        updateHybridChart(hybridSeries: string[], hybridType: string): void {
            this.setHybridChartType(hybridType);
            this.chartConfig.series.forEach((series, index) => {
                if (hybridSeries.includes(series.name)) {
                    const isHybrid = hybridSeries.includes(series.name);
                    // TODO: may need to adjust based on what hybrid options become available in the future
                    const baseConfig = {
                        name: series.name,
                        type: isHybrid ? hybridType : this.chartType,
                        color: series.color,
                        dashStyle: 'solid',
                        data: series.data,
                        marker: {
                            symbol: 'circle'
                        }
                    };
                    this.chartConfig.series[index] = baseConfig;
                }
            });
        },
        setSelectedHybridSeries(series: string[]) {
            this.selectedHybridSeries = series;
        },

        getSelectedHybridSeries() {
            return this.selectedHybridSeries;
        }
    }
});

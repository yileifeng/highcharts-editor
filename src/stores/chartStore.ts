import { defineStore } from 'pinia';
import { HighchartsConfig } from '../definitions';

export const useChartStore = defineStore('chartProperties', {
    state: () => ({
        chartType: 'line' as string,
        hybridChartType: 'none' as string,
        chartSeries: [] as string[],
        chartConfig: {} as HighchartsConfig,
        defaultColours: ['#2caffe', '#f45b5b', '#91e8e1', '#8d4654']
    }),
    actions: {
        /* Set highcharts type **/
        setChartType(chartType: string) {
            this.chartType = chartType;
        },
        /* Set hybrid highcharts type **/
        setHybridChartType(chartType: string) {
            this.hybridChartType = chartType;
        },
        /* Set highcharts config (from imported json file) **/
        setChartConfig(chartConfig: HighchartsConfig) {
            this.chartConfig = chartConfig;
        },
        /* Setup highcharts configuration for line chart **/
        setupLineChart(seriesNames: string[], cats: string[], seriesData: number[][]) {
            this.chartConfig = {
                title: {
                    text: 'Line Chart'
                },
                subtitle: {
                    text: ''
                },
                xAxis: {
                    categories: cats,
                    title: {
                        text: ''
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
            console.log('SETTING UP LINE CHART: ', this.chartConfig);
        },
        /* Setup highcharts configuration for bar chart **/
        setupBarChart(seriesNames: string[], cats: string[], seriesData: number[][]) {
            this.chartConfig = {
                title: {
                    text: 'Bar Chart'
                },
                subtitle: {
                    text: ''
                },
                xAxis: {
                    categories: cats,
                    title: {
                        text: ''
                    }
                },
                yAxis: {
                    title: {
                        text: ''
                    }
                },
                series: seriesNames.map((name, index) => ({
                    name: name,
                    type: 'bar',
                    color: this.defaultColours[index],
                    dashStyle: 'solid',
                    marker: {
                        symbol: 'circle'
                    },
                    data: seriesData[index]
                }))
            };
            console.log('SETTING UP BAR CHART: ', this.chartConfig);
        },
        /* Setup highcharts configuration for scatter plot **/
        setupScatterPlot(seriesNames: string[], seriesData: { x: number; y: number }[] | number[][], cats?: string[]) {
            this.chartConfig = {
                title: {
                    text: 'Scatter Plot'
                },
                subtitle: {
                    text: ''
                },
                xAxis: {
                    ...(cats ? { categories: cats } : {}),
                    title: {
                        text: ''
                    }
                },
                yAxis: {
                    title: {
                        text: ''
                    }
                },
                series: seriesNames.map((name, index) => ({
                    name: name,
                    type: 'scatter',
                    color: this.defaultColours[index],
                    dashStyle: 'solid',
                    marker: {
                        symbol: 'circle'
                    },
                    data: seriesData[index]
                }))
            };
            console.log('CHART CONFIG SCATTER: ', this.chartConfig);
        },
        /* Setup highcharts configuration for column chart **/
        setupColumnChart(seriesNames: string[], cats: string[], seriesData: number[][]) {
            this.chartConfig = {
                title: {
                    text: 'Column Chart'
                },
                subtitle: {
                    text: ''
                },
                xAxis: {
                    categories: cats,
                    title: {
                        text: ''
                    }
                },
                yAxis: {
                    title: {
                        text: ''
                    }
                },
                series: seriesNames.map((name, index) => ({
                    name: name,
                    type: 'column',
                    color: this.defaultColours[index],
                    dashStyle: 'solid',
                    data: seriesData[index]
                }))
            };
        },
        /* Setup highcharts configuration for pie chart **/
        setupPieChart(seriesNames: string[], seriesData: { name: string; y: number }[]) {
            this.chartConfig = {
                title: { text: 'Pie Chart' },
                subtitle: {
                    text: ''
                },
                series: [
                    {
                        name: seriesNames[0],
                        type: 'pie',
                        data: seriesData
                    }
                ]
            };
        },
        setupHybridChart(hybridSeries: string[], hybridType: string) {
            this.setHybridChartType(hybridType);
            this.chartConfig.series.forEach((series, index) => {
                if (hybridSeries.includes(series.name)) {
                    // TODO: may need to adjust based on what hybrid options become available in the future
                    const baseConfig = {
                        name: series.name,
                        type: hybridType,
                        color: series.color,
                        dashStyle: 'solid',
                        data: series.data
                    };
                    this.chartConfig.series[index] = { ...baseConfig, ...(hybridType === 'line' || hybridType === 'scatter' ? { marker: { symbol: 'circle' } } : {}) };
                }
            });
        }
    }
});

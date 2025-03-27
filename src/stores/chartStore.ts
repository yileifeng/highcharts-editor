import { defineStore } from 'pinia';
import { HighchartsConfig } from '../definitions';

export const useChartStore = defineStore('chartProperties', {
    state: () => ({
        chartType: 'line' as string,
        chartSeries: [] as string[],
        chartConfig: {} as HighchartsConfig
    }),
    actions: {
        /* Set highcharts type **/
        setChartType(chartType: string) {
            this.chartType = chartType;
        },
        /* Set highcharts config (from imported json file) **/
        setChartConfig(chartConfig: HighchartsConfig) {
            this.chartConfig = chartConfig;
        },
        /* Setup highcharts configuration for line chart **/
        setupLineChart(seriesNames: string[], cats: string[], seriesData: number[]) {
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
                series: [
                    {
                        name: seriesNames[0],
                        type: 'line',
                        color: '#2caffe',
                        dashStyle: 'solid',
                        marker: {
                            symbol: 'circle'
                        },
                        data: seriesData
                    }
                ]
            };
            console.log('SETTING UP LINE CHART: ', this.chartConfig);
        },
        /* Setup highcharts configuration for bar chart **/
        setupBarChart(seriesNames: string[], cats: string[], seriesData: number[]) {
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
                series: [
                    {
                        name: seriesNames[0],
                        type: 'bar',
                        color: '#2caffe',
                        dashStyle: 'solid',
                        marker: {
                            symbol: 'circle'
                        },
                        data: seriesData
                    }
                ]
            };
            console.log('SETTING UP BAR CHART: ', this.chartConfig);
        },
        /* Setup highcharts configuration for scatter plot **/
        setupScatterPlot(seriesNames: string[], seriesData: { x: number; y: number }[] | number[], cats?: string[]) {
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
                series: [
                    {
                        name: seriesNames[0],
                        type: 'scatter',
                        color: '#2caffe',
                        dashStyle: 'solid',
                        marker: {
                            symbol: 'circle'
                        },
                        data: seriesData
                    }
                ]
            };
            console.log('CHART CONFIG SCATTER: ', this.chartConfig);
        },
        /* Setup highcharts configuration for column chart **/
        setupColumnChart(seriesNames: string[], cats: string[], seriesData: number[]) {
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
                series: [
                    {
                        name: seriesNames[0],
                        type: 'column',
                        color: '#2caffe',
                        dashStyle: 'solid',
                        data: seriesData
                    }
                ]
            };
        },
        /* Setup highcharts configuration for pie chart **/
        setupPieChart(seriesNames: string[], seriesData: { name: string; y: number }[]) {
            this.chartConfig = {
                title: { text: 'Pie Chart' },
                subtitle: {
                    text: ''
                },
                colors: [],
                series: [
                    {
                        name: seriesNames[0],
                        type: 'pie',
                        data: seriesData
                    }
                ]
            };
        }
    }
});

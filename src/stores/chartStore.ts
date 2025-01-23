import { defineStore } from 'pinia';

interface HighchartsConfig {
    chart: {
        type: string;
    };
    title: {
        text: string;
    };
    credits?: {
        enabled: boolean;
    };
    subtitle?: {
        text: string;
    };
    yAxis?: {
        title: {
            text: string;
        };
    };
    xAxis?: {
        title: {
            text: string;
        };
        categories: (number | string)[];
    };
    data?: {
        csvURL: string;
        enablePolling: boolean;
    };
    plotOptions?: any;
    exporting?: {
        buttons: {
            contextButton: {
                menuItems: string[];
            };
        };
        enabled?: boolean;
    };
    series?: SeriesData[] | { data: SeriesData[] };
}

interface SeriesData {
    name: string;
    y?: number;
    data?: number[];
    type?: string;
}

export const useChartStore = defineStore('chartProperties', {
    state: () => ({
        chartType: '' as string,
        chartConfig: {} as HighchartsConfig
    }),
    actions: {
        /* Set highcharts type **/
        setChartType(chartType: string) {
            this.chartType = chartType;
        },
        /* Setup highcharts configuration for line chart **/
        setupLineChart(cats: string[], seriesData: number[]) {
            this.chartConfig = {
                chart: {
                    type: 'line'
                },
                title: {
                    text: 'Line Chart'
                },
                xAxis: {
                    cats
                },
                yAxis: {
                    title: {
                        text: 'Value'
                    }
                },
                series: [
                    {
                        name: 'Series 1',
                        data: seriesData
                    }
                ]
            };
        },
        /* Setup highcharts configuration for bar chart **/
        setupBarChart(cats: string[], seriesData: number[]) {
            this.chartConfig = {
                chart: {
                    type: 'bar'
                },
                title: {
                    text: 'Bar Chart'
                },
                xAxis: {
                    cats
                },
                yAxis: {
                    title: {
                        text: 'Value'
                    }
                },
                series: [
                    {
                        name: 'Series 1',
                        data: seriesData
                    }
                ]
            };
        },
        /* Setup highcharts configuration for scatter plot **/
        setupScatterPlot(seriesData: { x: number; y: number }[]) {
            this.chartConfig = {
                chart: {
                    type: 'scatter'
                },
                title: {
                    text: 'Scatter Plot'
                },
                xAxis: {
                    title: {
                        text: 'X Axis'
                    }
                },
                yAxis: {
                    title: {
                        text: 'Y Axis'
                    }
                },
                series: [
                    {
                        name: 'Scatter Data',
                        data: seriesData
                    }
                ]
            };
        },
        /* Setup highcharts configuration for column chart **/
        setupColumnChart(cats: string[], seriesData: number[]) {
            this.chartConfig = {
                chart: {
                    type: 'column'
                },
                title: {
                    text: 'Column Chart'
                },
                xAxis: {
                    cats
                },
                yAxis: {
                    title: {
                        text: 'Value'
                    }
                },
                series: [
                    {
                        name: 'Series 1',
                        data: seriesData
                    }
                ]
            };
        },
        /* Setup highcharts configuration for pie chart **/
        setupPieChart(data: { name: string; y: number }[]) {
            this.chartConfig = {
                chart: { type: 'pie' },
                title: { text: 'Pie Chart' },
                series: [
                    {
                        name: 'Share',
                        data
                    }
                ]
            };
        }
    }
});

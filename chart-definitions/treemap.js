//#-------------------------------------------
//# Treemap Class 
//#-------------------------------------------
class Treemap {
    chart_instance = null;
    chart_id = null;
    data = null;
    options = {
        series: [{ name: '', data: [] }],
        legend: {
            show: false
        },
        chart: {
            height: 350,
            type: 'area',
            animations: {
                enabled: false,
            },
            toolbar: {
                show: false,
            },
            sparkline: {
                enabled: true,
            },
            events: {
                // dataPointSelection: function (event, chartContext, opts) {
                //     console.log('data point selected', event, chartContext, opts);
                // }
            },
        },
        annotations: {
            xaxis: [],
            yaxis: [],
            points: [],
        },
        // annotations: {
        //     yaxis: [{
        //         y: 140,
        //         borderColor: '#00E396',
        //         label: {
        //             borderColor: '#00E396',
        //             style: {
        //                 color: '#fff',
        //                 background: '#00E396',
        //                 fontSize: '22px',
        //             },
        //             text: 'Support',
        //         }
        //     }]
        // },
        // fill: {
        //     type: "gradient",
        //     gradient: {
        //         shadeIntensity: 1,
        //         opacityFrom: 0.7,
        //         opacityTo: 0.9,
        //         stops: [0, 90, 100]
        //     }
        // },
        stroke: {
            width: [0.5, 5, 5, 5, 5],
        },
        plotOptions: {
            // treemap: {
            //     enableShades: true,
            //     shadeIntensity: 0.15,
            //     reverseNegativeShade: true,
            //     colorScale: {
            //         ranges: [
            //             {
            //                 from: -50,
            //                 to: 0,
            //                 color: '#e50000'
            //             },
            //             // {
            //             //     from: 0.001,
            //             //     to: 50,
            //             //     color: '#008000'
            //             // },
            //             // {
            //             //     from: 1000.001,
            //             //     to: 5000,
            //             //     color: '#48ff00'
            //             // }
            //         ]
            //     }
            // },
            treemap: {
                enableShades: true,
                shadeIntensity: 0.5,
                reverseNegativeShade: true,
                colorScale: {
                    ranges: [
                        {
                            from: -50,
                            to: 0,
                            color: '#CD363A'
                        },
                        {
                            from: 0.001,
                            to: 35,
                            color: '#52B12C'
                        }
                    ]
                }
            },
            bar: {
                // columnWidth: '99%',
                colors: {
                    _ranges: [
                        {
                            from: -10000,
                            to: 0,
                            color: '#cb0000ff'
                        }]
                },
                dataLabels: {
                    position: 'top', // top, center, bottom
                },
            },
            _line: {
                colors: {
                    threshold: 0,
                    colorAboveThreshold: '#008000', //'#0088ee',
                    colorBelowThreshold: '#ff0000',
                },
            },
        },
        tooltip: {
            // shared: false,
            // intersect: true,
            // followCursor: false,
            style: {
                fontSize: '24px',
            },
            x: {
                show: true,
                format: 'dd MMM | h:mm tt',
            },
            y: {
                formatter: function (value) {
                    return value.toLocaleString();
                }
            }
        },
        xaxis: {
            type: 'datetime',
            labels: {
                datetimeUTC: false
            }
        },
        yaxis: {},
        dataLabels: {
            enabled: false,
            textAnchor: 'middle',
            _offsetY: -5,
            style: {
                fontSize: '20px',
            },
            formatter: function (value, { seriesIndex, dataPointIndex, w }) {
                // return w.config.series[seriesIndex].name + ":  " + round(value / 1000);
                return round(value / 1000);
            }
        },
        dataLabels: {
            enabled: false,
            // textAnchor: 'middle',
            // style: {
            //     fontSize: '24px',
            // },
            // formatter: function (text, op) {
            //     // return [text, op.value];
            //     return op.value;
            // },
            offsetY: -4
        },
        noData: { text: 'No Data Available', style: {color: '#000'}},
        colors: ['#4CAF50', '#007bf7', '#E91E63', '#445c68', '#FF9800'],
        _colors: [
            '#4CAF50',
        ],
        _title: {
            text: 'Basic Treemap'
        }
    };
    constructor(id) {
        this.chart_id = id;
    }
    render() {
        if (this.chart_instance) {
            // console.log(this.chart_id);
            this.chart_instance.destroy();
        }
        this.chart_instance = new ApexCharts(document.querySelector(`#${this.chart_id}`), this.options);
        this.chart_instance.render();
        // console.log(this.chart_id, this.options);
    }
}
class Chart {
    chart_instance = null;
    chart_id = null;
    data = null;
    // options = {
    //     series: [{ name: '', data: [] }],
    //     legend: {
    //         show: false
    //     },
    //     chart: {
    //         height: 350,
    //         type: 'area',
    //         animations: {
    //             enabled: false,
    //         },
    //         toolbar: {
    //             show: false,
    //         },
    //         sparkline: {
    //             enabled: true,
    //         },
    //         events: {
    //             // dataPointSelection: function (event, chartContext, opts) {
    //             //     console.log('data point selected', event, chartContext, opts);
    //             // }
    //         },
    //     },
    //     annotations: {
    //         xaxis: [],
    //         yaxis: [],
    //         points: [],
    //     },
    //     // annotations: {
    //     //     yaxis: [{
    //     //         y: 140,
    //     //         borderColor: '#00E396',
    //     //         label: {
    //     //             borderColor: '#00E396',
    //     //             style: {
    //     //                 color: '#fff',
    //     //                 background: '#00E396',
    //     //                 fontSize: '22px',
    //     //             },
    //     //             text: 'Support',
    //     //         }
    //     //     }]
    //     // },
    //     // fill: {
    //     //     type: "gradient",
    //     //     gradient: {
    //     //         shadeIntensity: 1,
    //     //         opacityFrom: 0.7,
    //     //         opacityTo: 0.9,
    //     //         stops: [0, 90, 100]
    //     //     }
    //     // },
    //     stroke: {
    //         width: [0.5, 5, 5, 5, 5, 5, 5],
    //         curve: ['monotoneCubic'],
    //     },
    //     plotOptions: {
    //         // treemap: {
    //         //     enableShades: true,
    //         //     shadeIntensity: 0.15,
    //         //     reverseNegativeShade: true,
    //         //     colorScale: {
    //         //         ranges: [
    //         //             {
    //         //                 from: -50,
    //         //                 to: 0,
    //         //                 color: '#e50000'
    //         //             },
    //         //             // {
    //         //             //     from: 0.001,
    //         //             //     to: 50,
    //         //             //     color: '#008000'
    //         //             // },
    //         //             // {
    //         //             //     from: 1000.001,
    //         //             //     to: 5000,
    //         //             //     color: '#48ff00'
    //         //             // }
    //         //         ]
    //         //     }
    //         // },
    //         treemap: {
    //             enableShades: true,
    //             shadeIntensity: 0.5,
    //             reverseNegativeShade: true,
    //             colorScale: {
    //                 ranges: [
    //                     {
    //                         from: -50,
    //                         to: 0,
    //                         color: '#CD363A'
    //                     },
    //                     {
    //                         from: 0.001,
    //                         to: 35,
    //                         color: '#52B12C'
    //                     }
    //                 ]
    //             }
    //         },
    //         bar: {
    //             // columnWidth: '99%',
    //             colors: {
    //                 _ranges: [
    //                     {
    //                         from: -10000,
    //                         to: 0,
    //                         color: '#cb0000ff'
    //                     }]
    //             },
    //             dataLabels: {
    //                 position: 'top', // top, center, bottom
    //             },
    //         },
    //         _line: {
    //             colors: {
    //                 threshold: 0,
    //                 colorAboveThreshold: '#008000', //'#0088ee',
    //                 colorBelowThreshold: '#ff0000',
    //             },
    //         },
    //     },
    //     tooltip: {
    //         shared: true,
    //         // intersect: true,
    //         // followCursor: false,
    //         style: {
    //             fontSize: '24px',
    //         },
    //         x: {
    //             show: true,
    //             format: 'dd MMM | h:mm tt',
    //         },
    //         y: {
    //             formatter: function (value) {
    //                 return value.toLocaleString();
    //             }
    //         }
    //     },
    //     xaxis: {
    //         type: 'datetime',
    //         labels: {
    //             datetimeUTC: false
    //         }
    //     },
    //     yaxis: {},
    //     dataLabels: {
    //         enabled: false,
    //         textAnchor: 'middle',
    //         _offsetY: -5,
    //         style: {
    //             fontSize: '20px',
    //         },
    //         formatter: function (value, { seriesIndex, dataPointIndex, w }) {
    //             // return w.config.series[seriesIndex].name + ":  " + round(value / 1000);
    //             return round(value / 1000);
    //         }
    //     },
    //     // dataLabels: {
    //     //     enabled: false,
    //     //     // textAnchor: 'middle',
    //     //     // style: {
    //     //     //     fontSize: '24px',
    //     //     // },
    //     //     // formatter: function (text, op) {
    //     //     //     // return [text, op.value];
    //     //     //     return op.value;
    //     //     // },
    //     //     offsetY: -4
    //     // },
    //     annotations: {
    //         xaxis: [],
    //         yaxis: [],
    //         points: [],
    //     },
    //     noData: { text: 'No Data Available', style: { color: '#000' } },
    //     colors: ['#4CAF50', '#007bf7', '#E91E63', '#445c68', '#FF9800'],
    //     _colors: [
    //         '#4CAF50',
    //     ],
    //     _title: {
    //         text: 'Basic Treemap'
    //     }
    // };
    options = {
        series: [
            {
                name: 'TEAM A',
                type: 'area',
                data: [],
            },
            {
                name: 'TEAM B',
                type: 'line',
                data: [],
            },
        ],
        chart: {
            height: 350,
            type: 'area',
            sparkline: {
                enabled: true,
            },
            animations: {
                enabled: false,
            },
        },
        annotations: {},
        stroke: {
            curve: 'smooth',
        },
        fill: {
            type: 'gradient',
            opacity: [0.35, 1],
        },
        _labels: [
            'Dec 01',
        ],
        markers: {
            size: 0,
        },
        noData: { text: 'No Data Available', style: { color: '#000' } },
        colors: ['#4CAF50', '#007bf7', '#E91E63', '#445c68', '#FF9800'],
        xaxis: {
            type: 'datetime',
            labels: {
                datetimeUTC: false
            }
        },
        yaxis: [
            {
                title: {
                    text: 'Series A',
                },
            },
            {
                opposite: true,
                title: {
                    text: 'Series B',
                },
            },
        ],
        tooltip: {
            shared: true,
            intersect: false,
            style: {
                fontSize: '16px',
            },
            x: {
                show: true,
                format: 'dd MMM | h:mm tt',
            },
            y: {
                formatter: function (y) {
                    // if (typeof y !== 'undefined') {
                    //     return y.toFixed(0)
                    // }
                    return round2(y).toLocaleString()
                },
            },
        },
    };
    constructor(id) {
        this.chart_id = id;
    }
    _render() {
        if (this.chart_instance) {
            // console.log(this.chart_id);
            this.chart_instance.destroy();
        }
        this.chart_instance = new ApexCharts(document.querySelector(`#${this.chart_id}`), this.options);
        this.chart_instance.render();
        // console.log(this.chart_id, this.options);
    }

    add_annotation_x = (x, text = null, color = colors.black, offsetX = 0) => {
        const obj = { x, borderWidth: 2, borderColor: color, fillColor: color, opacity: 1, strokeDashArray: 0 };
        if (text) {
            obj.label = { text, offsetX, offsetY: 15, orientation: 'horizontal', style: { fontSize: '22px' } };
        }
        return obj;
    }
    add_annotation_y = (y, color = colors.black) => {
        const obj = { y, borderColor: color, fillColor: color, opacity: 1, strokeDashArray: 0 };
        // if (text) {
        //     obj.label  = { text, offsetX, offsetY, style: { fontSize: '22px' } };
        // }
        return obj;
    }
    add_annotation_point = (x, y, size = 4.5, color = colors.black, text = null, offsetX = 0, offsetY = 0) => {
        const obj = { x, y, marker: { size, fillColor: color } };
        if (text) {
            obj.label = { text, offsetX, offsetY, style: { fontSize: '22px' } };
        }
        return obj;
    }
    add_annotation_point_2 = (x, y, text = null, offsetX = 0, offsetY = 0) => {
        const obj = { x, y, marker: { size: 4.5, fillColor: colors.black } };
        if (text) {
            obj.label = { text, offsetX, offsetY, style: { fontSize: '22px' } };
        }
        return obj;
    }

    //@ SYMBOL CHART - 24H */
    update(data, height = 280, raw = false) {
        // const raw = INDICATORS.indexOf(name) >= 0;
        let series = [
            { name: 'Close', type: 'area', data: [] },
            // { name: 'Open', type: 'line', data: [] },
        ];
        let start = data[0].c;
        let shares = 1000 / start;
        series[0].data = data.map((v, i) => { return { x: new Date(v.t).getTime(), y: (v.c) * (raw ? 1 : shares) } });
        // series[1].data = data.map((v, i) => { return { x: new Date(v.t).getTime(), y: (v.o) * shares } });
        // if (futures) {
        //     series.push({ name: 'Futures', type: 'area', data: [] });
        //     start = futures[0].c;
        //     shares = raw ? 1 : INVEST_AMOUNT / start;
        //     series[1].data = futures.map((v, i) => { return { x: new Date(v.t).getTime(), y: (v.c) * shares } });
        // }
        this.options.tooltip.enabledOnSeries = [0, 1];
        this.options.stroke.width = [0.75, 2];
        this.options.annotations.xaxis = [];
        this.options.annotations.yaxis = [];

        const d3 = series[0].data[series[0].data.length - 1].x;
        const d2 = d3 - (24 * 60 * 60 * 1000);
        // const d1 = d3 - (2 * 24 * 60 * 60 * 1000);
        // const add_shade = (e, o = 0.25) => {
        //     this.options.annotations.xaxis[chart.options.annotations.xaxis.length - 1].x2 = e;
        //     this.options.annotations.xaxis[chart.options.annotations.xaxis.length - 1].opacity = o;
        // }
        // add_shade(new Date(d3).setHours(9, 30), 0.1);
        // this.options.annotations.xaxis.push(this.add_annotation_x(new Date(d3).setHours(0, 0), null, colors.gray));
        this.options.annotations.xaxis.push(this.add_annotation_x(new Date(d3).setHours(4, 0), null, colors.lightgrey));
        this.options.annotations.xaxis.push(this.add_annotation_x(new Date(d3).setHours(9, 30), null, colors.teal));
        this.options.annotations.xaxis.push(this.add_annotation_x(new Date(d3).setHours(10, 0), null, colors.lightgrey));
        this.options.annotations.xaxis.push(this.add_annotation_x(new Date(d3).setHours(11, 0), null, colors.lightgrey));
        this.options.annotations.xaxis.push(this.add_annotation_x(new Date(d3).setHours(12, 0), null, colors.lightgrey));
        this.options.annotations.xaxis.push(this.add_annotation_x(new Date(d3).setHours(13, 0), null, colors.lightgrey));
        this.options.annotations.xaxis.push(this.add_annotation_x(new Date(d3).setHours(14, 0), null, colors.lightgrey));
        this.options.annotations.xaxis.push(this.add_annotation_x(new Date(d3).setHours(15, 0), null, colors.lightgrey));
        // this.options.annotations.xaxis.push(this.add_annotation_x(new Date(d3).setHours(10, 30), null, colors.lightgrey));
        // this.options.annotations.xaxis.push(this.add_annotation_x(new Date(d3).setHours(11, 30), null, colors.lightgrey));
        // this.options.annotations.xaxis.push(this.add_annotation_x(new Date(d3).setHours(15, 30), null, colors.lightgrey));
        this.options.annotations.xaxis.push(this.add_annotation_x(new Date(d3).setHours(16, 0), null, colors.teal));
        this.options.annotations.xaxis.push(this.add_annotation_x(new Date(d3).setHours(20, 0), null, colors.lightgrey));

        this.options.annotations.xaxis.push(this.add_annotation_x(new Date(d2).setHours(16, 0), null, colors.teal));
        this.options.annotations.xaxis.push(this.add_annotation_x(new Date(d2).setHours(20, 0), null, colors.lightgrey));

        // this.options.annotations.xaxis.push(this.add_annotation_x(new Date(d2).setHours(4, 0), null, colors.darkgray));
        // this.options.annotations.xaxis.push(this.add_annotation_x(new Date(d2).setHours(9, 30), null, colors.teal));
        // this.options.annotations.xaxis.push(this.add_annotation_x(new Date(d2).setHours(16, 0), null, colors.deeppink));

        // this.options.annotations.xaxis.push(this.add_annotation_x(new Date(d1).setHours(4, 0), null, colors.darkgray));
        // this.options.annotations.xaxis.push(this.add_annotation_x(new Date(d1).setHours(9, 30), null, colors.lightgrey));
        this.options.annotations.yaxis.push(this.add_annotation_y(series[0].data[series[0].data.length - 1].y * 1.005, colors.violet));
        this.options.annotations.yaxis.push(this.add_annotation_y(series[0].data[series[0].data.length - 1].y, colors.grey));

        this.options.chart.height = height;
        this.options.series = series;
        this._render();
    }
}
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
        // plotOptions: {
        //     bar: {
        //         colors: {
        //             ranges: [
        //                 {
        //                     from: -100,
        //                     to: 0,
        //                     color: '#F15B46',
        //                 },
        //                 {
        //                     from: 0,
        //                     to: 100,
        //                     color: '#04d462',
        //                 },
        //             ],
        //         },
        //         columnWidth: '80%',
        //     },
        // },
        annotations: {
            xaxis: [],
            yaxis: [],
            points: [],
        },
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
    options_candlestick = {
        series: [
            {
                name: 'line',
                type: 'line',
                data: [],
            },
            {
                name: 'candle',
                type: 'candlestick',
                data: [
                    // {
                    //     x: new Date(1538778600000),
                    //     y: [6629.81, 6650.5, 6623.04, 6633.33],
                    // },
                ],
            },
        ],
        chart: {
            height: 180,
            type: 'line',
            animations: {
                enabled: false,
            },
            toolbar: {
                show: false,
            },
            sparkline: {
                enabled: true,
            }
        },
        title: {
            _text: 'CandleStick Chart',
            align: 'left',
        },
        legend: {
            show: false,
        },
        plotOptions: {
            bar: {
                colors: {
                    ranges: [
                        {
                            from: -100,
                            to: 0,
                            color: '#F15B46',
                        },
                        {
                            from: 0,
                            to: 100,
                            color: '#04d462',
                        },
                    ],
                },
                columnWidth: '80%',
            },
        },
        annotations: {
            xaxis: [],
            yaxis: [],
            points: [],
        },
        stroke: {
            width: [2, 0.5],
        },
        noData: { text: 'No Data Available', style: { color: '#000' } },
        colors: ['#007bf7', '#4CAF50', '#E91E63', '#445c68', '#FF9800'],
        _fill: {
            type: 'gradient',
            opacity: [1, 1],
        },
        tooltip: {
            shared: true,
            x: {
                show: true,
                format: 'dd MMM | h:mm tt',
            },
            custom: [
                // function ({ seriesIndex, dataPointIndex, w }) {
                //     return w.globals.series[seriesIndex][dataPointIndex]
                // },
                function ({ seriesIndex, dataPointIndex, w }) {
                    var hmm = HELPERS.getHMM(new Date(w.seriesData.seriesX[0][dataPointIndex])).toString();
                    hmm = hmm.length === 3 ? `${hmm.slice(0, 1)}:${hmm.slice(1)}` : `${hmm.slice(0, 2)}:${hmm.slice(2)}`;
                    var o = w.globals.seriesCandleO[seriesIndex][dataPointIndex].toLocaleString();
                    var h = w.globals.seriesCandleH[seriesIndex][dataPointIndex].toLocaleString();
                    var l = w.globals.seriesCandleL[seriesIndex][dataPointIndex].toLocaleString();
                    var c = w.globals.seriesCandleC[seriesIndex][dataPointIndex].toLocaleString();
                    return (
                        '<div class="apexcharts-tooltip-candlestick">' +
                        '<div style="border-bottom:1px solid;"><b><span class="w3-wide">' +
                        hmm +
                        '</span></b></div>' +
                        '<div>Open: <span class="value">' +
                        o +
                        '</span></div>' +
                        '<div>High: <span class="value">' +
                        h +
                        '</span></div>' +
                        '<div>Low: <span class="value">' +
                        l +
                        '</span></div>' +
                        '<div>Close: <b><span class="value w3-text-blue">' +
                        c +
                        '</span></b></div>' +
                        '</div>'
                    )
                },
            ],
        },
        xaxis: {
            type: 'datetime',
            labels: {
                datetimeUTC: false
            }
        },
    };
    options_mixed = {
        series: [
            {
                name: 'Profit',
                type: 'column',
                data: [5, 12, -8, 14, -3, 9, -2, 6],
            },
            {
                name: 'Units Sold',
                type: 'column',
                data: [1.2, 2.1, 1.8, 2.7, 2.0, 2.4, 1.9, 2.6],
            },
            {
                name: 'Index',
                type: 'line',
                data: [25, 27, 26, 29, 28, 29, 30, 30],
            },
        ],
        chart: {
            height: 350,
            type: 'line',
            stacked: false,
        },
        stroke: {
            width: [0, 0, 4],
        },
        annotations: {
            xaxis: [],
            yaxis: [],
            points: [],
        },
        title: {
            text: 'Multiple Y-Axes With Aligned Zero',
            align: 'left',
        },
        xaxis: {
            categories: ['Q1', 'Q2', 'Q3', 'Q4', 'Q5', 'Q6', 'Q7', 'Q8'],
        },
        yaxis: [
            {
                seriesName: 'Profit',
                alignZero: true,
                axisTicks: { show: true },
                axisBorder: { show: true, color: '#008FFB' },
                labels: { style: { colors: '#008FFB' } },
                title: { text: 'Profit (mixed +/-)', style: { color: '#008FFB' } },
            },
            {
                seriesName: 'Units Sold',
                alignZero: true,
                opposite: true,
                axisTicks: { show: true },
                axisBorder: { show: true, color: '#00E396' },
                labels: { style: { colors: '#00E396' } },
                title: { text: 'Units (positive only)', style: { color: '#00E396' } },
            },
            {
                seriesName: 'Index',
                alignZero: true,
                opposite: true,
                axisTicks: { show: true },
                axisBorder: { show: true, color: '#FEB019' },
                labels: { style: { colors: '#FEB019' } },
                title: { text: 'Index', style: { color: '#FEB019' } },
            },
        ],
        tooltip: { shared: true, intersect: false },
        legend: { horizontalAlign: 'left' },
    }
    constructor(id) {
        this.chart_id = id;
    }
    _render(o = this.options) {
        if (this.chart_instance) {
            // console.log(this.chart_id);
            this.chart_instance.destroy();
        }
        this.chart_instance = new ApexCharts(document.querySelector(`#${this.chart_id}`), o);
        this.chart_instance.render();
        // console.log(this.chart_id, this.options);
    }

    add_annotation_x = (x, text = null, color = colors.black, offsetX = 0) => {
        const obj = { x, borderWidth: 1, borderColor: color, fillColor: color, opacity: 1, strokeDashArray: 0 };
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
    update(data, height = 280, raw = false, type = null) {
        // const raw = INDICATORS.indexOf(name) >= 0;
        let series = [
            { name: 'Close', type: 'area', data: [] },
            // { name: 'Bollinger', type: 'line', data: [] },
        ];
        let start = data[0].c;
        let shares = 1000 / start;
        if (type === 'ohlc') {
            const ohlc_data = calculateHeikinAshi(data);
            series[0].type = 'candlestick';
            series[0].data = ohlc_data
                // .slice(-200)
                .filter((v) => HELPERS.getYMD(new Date(v.e)) === HELPERS.getYMD(new Date(ohlc_data[ohlc_data.length - 1].e)))
                .filter((v) => HELPERS.getHMM(new Date(v.e)) >= 930)
                .filter((v) => HELPERS.getHMM(new Date(v.e)) <= 1600)
                .map((v, i) => { return { x: v.e, y: [round2(v.o * shares), round2(v.h * shares), round2(v.l * shares), round2(v.c * shares)] } });
            // series.push({
            //     name: 'Close',
            //     type: 'bar',
            //     data: ohlc_data
            //         .filter((v) => HELPERS.getHMM(new Date(v.e)) >= 930)
            //         .filter((v) => HELPERS.getHMM(new Date(v.e)) <= 1600)
            //         .map((v, i) => { return { x: v.e, y: round2(v.d * shares * 100) } })
            // })
            const d3 = series[0].data[series[0].data.length - 1].x;
            this.options_candlestick.annotations.xaxis = [];
            this.options_candlestick.annotations.xaxis.push(this.add_annotation_x(new Date(d3).setHours(10, 0), null, colors.lightgrey));
            this.options_candlestick.annotations.xaxis.push(this.add_annotation_x(new Date(d3).setHours(11, 0), null, colors.lightgrey));
            this.options_candlestick.annotations.xaxis.push(this.add_annotation_x(new Date(d3).setHours(15, 30), null, colors.lightgrey));

            // this.options_candlestick.annotations.points = []
            // let count = 0;
            // let is_up = true;
            // series[0].data.forEach((v) => {
            //     count += v.y[3] < v.y[0] ? 1 : 0;
            //     if (count >= 5) {
            //         this.options_candlestick.annotations.points.push(this.add_annotation_point(v.x, v.y[3], 1.5, colors.deepskyblue));
            //         count = 0;
            //         is_up = false;
            //     }is_up = true
            // })

            this.options_candlestick.chart.type = 'line';
            this.options_candlestick.chart.height = height;
            this.options_candlestick.series = series;
            this._render(this.options_candlestick);

            // console.chart(ohlc_data.map((v) => {
            //     return {
            //         x: HELPERS.getHMM(new Date(v.e)),
            //         y: round2(v.d * shares * 10)
            //     }
            // }).filter((v) => v.x >= 1000 && v.x <= 1200).map((v) => v.y)
            // );
        } else
            if (type === 'mixed') {
                const hmm_s = 900;
                const hmm_e = 1130;
                const ohlc_data = calculateHeikinAshi(data);
                series[0].type = 'bar';
                series[0].data = ohlc_data
                    // .slice(-200)
                    .filter((v) => HELPERS.getYMD(new Date(v.e)) === HELPERS.getYMD(new Date(ohlc_data[ohlc_data.length - 1].e)))
                    .filter((v) => HELPERS.getHMM(new Date(v.e)) >= hmm_s)
                    .filter((v) => HELPERS.getHMM(new Date(v.e)) <= hmm_e)
                    .map((v, i) => { return { x: v.e, y: round2(v.d * shares) } });
                let cumulative = 0;
                series.push({
                    name: 'Gain',
                    type: 'line',
                    color: colors.teal,
                    data: ohlc_data
                        .filter((v) => HELPERS.getHMM(new Date(v.e)) >= hmm_s)
                        .filter((v) => HELPERS.getHMM(new Date(v.e)) <= hmm_e)
                        .map((v, i) => { cumulative += (v.d * shares); return { x: v.e, y: round2(cumulative) } })
                })
                const d3 = series[0].data[series[0].data.length - 1].x;
                this.options_candlestick.annotations.xaxis = [];
                this.options_candlestick.annotations.xaxis.push(this.add_annotation_x(new Date(d3).setHours(9, 30), null, colors.deeppink));
                this.options_candlestick.annotations.xaxis.push(this.add_annotation_x(new Date(d3).setHours(10, 0), null, colors.lightgrey));
                this.options_candlestick.annotations.xaxis.push(this.add_annotation_x(new Date(d3).setHours(11, 0), null, colors.lightgrey));
                this.options_candlestick.annotations.xaxis.push(this.add_annotation_x(new Date(d3).setHours(15, 30), null, colors.lightgrey));

                this.options_candlestick.stroke.width = [1, 2];
                this.options_candlestick.yaxis = [
                    {
                        seriesName: 'Gain',
                        alignZero: true,
                        axisTicks: { show: true },
                        axisBorder: { show: true, color: '#008FFB' },
                        labels: { style: { colors: '#008FFB' } },
                        title: { text: 'Profit (mixed +/-)', style: { color: '#008FFB' } },
                    },
                    {
                        seriesName: 'Close',
                        alignZero: true,
                        opposite: true,
                        axisTicks: { show: true },
                        axisBorder: { show: true, color: '#00E396' },
                        labels: { style: { colors: '#00E396' } },
                        title: { text: 'Units (positive only)', style: { color: '#00E396' } },
                    },
                ];
                // this.options_candlestick.yaxis[0].min = -10;
                // this.options_candlestick.yaxis[1].min = -10;

                // this.options_candlestick.annotations.points = []
                // let count = 0;
                // let is_up = true;
                // series[0].data.forEach((v) => {
                //     count += v.y[3] < v.y[0] ? 1 : 0;
                //     if (count >= 5) {
                //         this.options_candlestick.annotations.points.push(this.add_annotation_point(v.x, v.y[3], 1.5, colors.deepskyblue));
                //         count = 0;
                //         is_up = false;
                //     }is_up = true
                // })

                delete this.options_candlestick.tooltip.custom;
                this.options_candlestick.chart.type = 'line';
                this.options_candlestick.chart.height = height;
                this.options_candlestick.series = series;
                this._render(this.options_candlestick);

                // console.chart(ohlc_data.map((v) => {
                //     return {
                //         x: HELPERS.getHMM(new Date(v.e)),
                //         y: round2(v.d * shares * 10)
                //     }
                // }).filter((v) => v.x >= 1000 && v.x <= 1200).map((v) => v.y)
                // );
            } else {
                series[0].data = data.map((v, i) => { return { x: new Date(v.t).getTime(), y: (v.c) * (raw ? 1 : shares) } });

                // const bands = applyBands(data.map((v)=>{ return { c: v.c }}),4,1);
                // series[1].data = bands.map((v, i) => { return { x: series[0].data[i].x, y: v.bands_c.sma * shares } });

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
}
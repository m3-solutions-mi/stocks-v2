class Chart {
    chart_instance = null;
    chart_instance_m = null;
    chart_instance_t = null;
    chart_id = null;
    chart_id_m = null;
    chart_id_t = null;
    data = null;

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
        _fill: {
            type: 'gradient',
            opacity: [-1, 1],
        },
        fill: {
            // type: 'vertical',
            gradient: {
                // type: 'horizontal',
                opacityFrom: [0.8, 0, 0],
                opacityTo: [0.2, 0, 0],
            }
        },
        _labels: [
            'Dec 01',
        ],
        markers: {
            size: 0,
        },
        noData: { text: 'No Data Available', style: { color: '#000' } },
        colors: ['#4CAF50', '#9e88ff', '#9e88ff', '#E91E63', '#445c68', '#FF9800'],
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
            // {
            //     opposite: true,
            //     title: {
            //         text: 'Series B',
            //     },
            // },
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
                            from: -1500,
                            to: -1.5,
                            color: '#d80000',
                        },
                        {
                            from: -1.5,
                            to: 0,
                            color: '#e46d5d',
                        },
                        {
                            from: 0,
                            to: 25,
                            color: '#45d887',
                        },
                        {
                            from: 25,
                            to: 1500,
                            color: '#008f40',
                        },
                    ],
                },
                _columnWidth: '130%',
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
            style: {
                fontSize: '16px',
            },
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
                        '<div style="border-bottom:1px solid;"><b><span class="w3-xlarge w3-wide">' +
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
                axisTicks: { show: false },
                axisBorder: { show: false, color: '#00E396' },
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
    options_treemap = {
        series: [
            {
                data: [
                    {
                        x: 'INTC',
                        y: 1.2,
                    },
                ],
            },
        ],
        legend: {
            show: false,
        },
        chart: {
            height: 350,
            type: 'treemap',
            animations: { enabled: false, },
            toolbar: { show: false, },
        },
        _title: {
            text: 'Treemap with Color scale',
        },
        noData: {
            text: 'NO DATA',
        },
        dataLabels: {
            enabled: true,
            style: {
                fontSize: '12px',
            },
            formatter: function (text, op) {
                return [text, op.value]
            },
            offsetY: -4,
        },
        plotOptions: {
            treemap: {
                enableShades: true,
                shadeIntensity: 0.5,
                reverseNegativeShade: true,
                colorScale: {
                    ranges: [
                        {
                            from: -5,
                            to: 0,
                            color: '#CD363A',
                        },
                        {
                            from: 0,
                            to: 5,
                            color: '#6dc573',
                        },
                    ],
                },
            },
        },
    }
    constructor(id, id_m = null, id_t = null) {
        this.chart_id = id;
        this.chart_id_m = id_m;
        this.chart_id_t = id_t;
    }

    //#region /* RENDER */
    _render(o = this.options_candlestick) {
        if (this.chart_instance) {
            // console.log(this.chart_id);
            this.chart_instance.destroy();
        }
        this.chart_instance = new ApexCharts(document.querySelector(`#${this.chart_id}`), o);
        this.chart_instance.render();
        // console.log(this.chart_id, this.options);
    }
    _render_m(o = this.options) {
        if (this.chart_instance_m) {
            // console.log(this.chart_id);
            this.chart_instance_m.destroy();
        }
        this.chart_instance_m = new ApexCharts(document.querySelector(`#${this.chart_id_m}`), o);
        this.chart_instance_m.render();
        // console.log(this.chart_id, this.options);
    }
    _render_t(o = this.options_treemap) {
        if (this.chart_instance_t) {
            // console.log(this.chart_id);
            this.chart_instance_t.destroy();
        }
        this.chart_instance_t = new ApexCharts(document.querySelector(`#${this.chart_id_t}`), o);
        this.chart_instance_t.render();
        // console.log(this.chart_id, this.options);
    }
    //#endregion

    //#region /* ANNOTATIONS */
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
    add_annotation_point = (x, y, size = 10, color = colors.black, text = null, fontSize = '22px', offsetX = 0, offsetY = 0) => {
        const obj = { x, y, marker: { size, fillColor: color } };
        if (text) {
            obj.label = { text, offsetX, offsetY, style: { fontSize } };
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
    //#endregion

    //@ SYMBOL CHART *** 2 *** - 24H */
    async update_2(symbol, mode, data, data_m, index, height = 280, timeframe = '15Min', summarize = false) {
        // const is_crypto = symbol.indexOf('-USD') < 0;
        // if (timeframe === 5) {
        //     data[data.length - 1].e = data[data.length - 2].e + (5 * 60 * 1000);
        // } else if (timeframe === 15) {
        //     data[data.length - 1].e = data[data.length - 2].e + (15 * 60 * 1000);
        // }

        if (data && data.length > 0) {

            //#region ADD ANNOTATIONS */
            this.options_candlestick.annotations = { xaxis: [], yaxis: [], points: [] };
            this.options.annotations = { xaxis: [], yaxis: [], points: [] };
            const annotations_x = () => {
                if (CONFIG.TIMEFRAME === 'minute') {
                    const d = data[data.length - 1].e;
                    const d2 = last.e - (24 * 60 * 60 * 1000);
                    const obj = [];
                    [d2, d].forEach((date) => {
                        [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].forEach((x) => {
                            obj.push(this.add_annotation_x(new Date(date).setHours(x, 0), null, colors.lightgrey));
                        });
                        obj.push(this.add_annotation_x(new Date(date).setHours(4, 0), null, colors.teal));
                        obj.push(this.add_annotation_x(new Date(date).setHours(9, 30), null, colors.deeppink));
                        obj.push(this.add_annotation_x(new Date(date).setHours(10, 30), null, colors.teal));
                        obj.push(this.add_annotation_x(new Date(date).setHours(16, 0), null, colors.deeppink));
                        obj.push(this.add_annotation_x(new Date(date).setHours(20, 0), null, colors.teal));
                    });
                    return obj;

                    // return [
                    //     this.add_annotation_x(new Date(d2).setHours(8, 0), null, colors.deeppink),
                    //     this.add_annotation_x(new Date(d2).setHours(9, 0), null, colors.lightgrey),
                    //     this.add_annotation_x(new Date(d2).setHours(10, 0), null, colors.lightgrey),
                    //     this.add_annotation_x(new Date(d2).setHours(11, 0), null, colors.lightgrey),
                    //     this.add_annotation_x(new Date(d2).setHours(12, 0), null, colors.lightgrey),
                    //     this.add_annotation_x(new Date(d2).setHours(13, 0), null, colors.lightgrey),
                    //     this.add_annotation_x(new Date(d2).setHours(14, 0), null, colors.lightgrey),
                    //     this.add_annotation_x(new Date(d2).setHours(15, 0), null, colors.lightgrey),
                    //     this.add_annotation_x(new Date(d2).setHours(16, 0), null, colors.lightgrey),
                    //     this.add_annotation_x(new Date(d2).setHours(17, 0), null, colors.lightgrey),
                    //     this.add_annotation_x(new Date(d2).setHours(18, 0), null, colors.lightgrey),
                    //     this.add_annotation_x(new Date(d2).setHours(19, 0), null, colors.lightgrey),
                    //     this.add_annotation_x(new Date(d2).setHours(20, 0), null, colors.deeppink),

                    //     // this.add_annotation_x(new Date(d).setHours(2, 15), null, colors.teal),
                    //     this.add_annotation_x(new Date(d).setHours(9, 30), null, colors.deeppink),
                    //     this.add_annotation_x(new Date(d).setHours(16, 0), null, colors.deeppink),

                    //     // this.add_annotation_x(new Date(d).setHours(0, 0), null, colors.lightgrey),
                    //     // this.add_annotation_x(new Date(d).setHours(1, 0), null, colors.lightgrey),
                    //     // this.add_annotation_x(new Date(d).setHours(2, 0), null, colors.lightgrey),
                    //     // this.add_annotation_x(new Date(d).setHours(3, 0), null, colors.lightgrey),
                    //     this.add_annotation_x(new Date(d).setHours(4, 0), null, colors.lightgrey),
                    //     this.add_annotation_x(new Date(d).setHours(5, 0), null, colors.lightgrey),
                    //     this.add_annotation_x(new Date(d).setHours(6, 0), null, colors.lightgrey),
                    //     this.add_annotation_x(new Date(d).setHours(7, 0), null, colors.lightgrey),
                    //     this.add_annotation_x(new Date(d).setHours(8, 0), null, colors.lightgrey),
                    //     this.add_annotation_x(new Date(d).setHours(9, 0), null, colors.lightgrey),
                    //     this.add_annotation_x(new Date(d).setHours(10, 0), null, colors.lightgrey),
                    //     this.add_annotation_x(new Date(d).setHours(11, 0), null, colors.lightgrey),
                    //     this.add_annotation_x(new Date(d).setHours(12, 0), null, colors.lightgrey),
                    //     this.add_annotation_x(new Date(d).setHours(13, 0), null, colors.lightgrey),
                    //     this.add_annotation_x(new Date(d).setHours(14, 0), null, colors.lightgrey),
                    //     this.add_annotation_x(new Date(d).setHours(15, 0), null, colors.lightgrey),
                    //     this.add_annotation_x(new Date(d).setHours(17, 0), null, colors.lightgrey),
                    //     this.add_annotation_x(new Date(d).setHours(18, 0), null, colors.lightgrey),
                    //     this.add_annotation_x(new Date(d).setHours(19, 0), null, colors.lightgrey),
                    //     this.add_annotation_x(new Date(d).setHours(20, 0), null, colors.lightgrey),
                    //     this.add_annotation_x(new Date(d).setHours(21, 0), null, colors.lightgrey),
                    //     this.add_annotation_x(new Date(d).setHours(22, 0), null, colors.lightgrey),
                    //     this.add_annotation_x(new Date(d).setHours(23, 0), null, colors.lightgrey),
                    // ]
                } else {
                    return [];
                }
            }
            const annotations_y = () => {
                const d = last.e;
                return [
                    // this.add_annotation_y(new Date(d).setHours(2, 15), null, colors.teal),
                    // this.add_annotation_y(new Date(d).setHours(9, 30), null, colors.deeppink),
                    // this.add_annotation_y(new Date(d).setHours(10, 0), null, colors.lightgrey),
                ]
            }
            const annotations_p = () => {
                const d = last.e;
                return [
                    // this.add_annotation_y(new Date(d).setHours(9, 30), null, colors.deeppink),
                    // this.add_annotation_y(new Date(d).setHours(10, 0), null, colors.lightgrey),
                ]
            }
            //#endregion

            //* MOVE HA last timestamp to end of 5 minutes */
            if (CONFIG.TIMEFRAME === 'minute') {
                data[data.length - 1].e = data[data.length - 2].e + (+(timeframe.replace('M', '')) * 60 * 1000);
            }

            //* TIME WINDOW VARIABLES */
            const is_crypto = symbol.indexOf('-USD') > 0;
            const dow = new Date().getDay();
            // const today = Date.now();
            // const yesterday = today - (24 * 60 * 60 * 1000);
            const current_day = data[data.length - 1].e;                                  //* accounts for when market is closed */
            const previous_day = current_day - (24 * 60 * 60 * 1000);
            const hmm = HELPERS.getHMM(new Date());

            //* REFERENCE VALUE */
            const last_eod = data.find((v) => v.e >= (new Date(current_day).setHours(0, 0)));
            // const last_eod = data.find((v) => v.e >= (new Date(current_day).setHours(4, 0)));
            // const last_eod = data.find((v) => v.e >= hmm >= 210 ? (new Date(today).setHours(2, 10)) : (new Date(today).setHours(0, 0)));
            // let s = mode === 'day' ? data[0].e : new Date(current_day).setHours(4, 0);

            let s = data[0].e;
            let e = data[data.length - 1].e;
            // if (hmm <= 900) { s = data[data.length - 1].e - (1 * 24 * 60 * 60 * 1000); }
            // if (hmm < 900) { s = new Date(current_day).setHours(4, 0); }
            // if (hmm < 850) { s = new Date(previous_day).setHours(19, 55); }
            if (symbol.indexOf('-USD') > 0) {
                s = current_day - ((IS_SMALL ? 4 : 8) * 60 * 60 * 1000);
                // s = new Date(current_day).setHours(0, 0);
                // if (hmm >= 1400) { s = new Date(current_day).setHours(8, 0); }
            } else {
                if (new Date(current_day).getDay() === dow) {
                    if (hmm < 400) { s = data[data.length - 1].e - (18 * 60 * 60 * 1000); }
                    if (hmm >= 400) { s = new Date(current_day).setHours(4, 0); }
                    if (hmm >= 900) { s = new Date(current_day).setHours(8, 0); }
                    if (hmm >= 929) { s = new Date(current_day).setHours(9, 0); }
                    if (hmm >= 1200) { s = new Date(current_day).setHours(9, 15); }
                    // if (hmm >= 830) { s = new Date(current_day).setHours(8, 0); }
                    // if (hmm >= 1605) { s = new Date(current_day).setHours(9, 15); }
                    // if (hmm <= 400) { s = new Date(current_day).setHours(4, 0); }
                    // if (hmm >= 915) { s = new Date(current_day).setHours(9, 0); }
                    // if (hmm >= 1430) { s = new Date(current_day).setHours(12, 0); }

                    // if (hmm <= 1200) { e = new Date(current_day).setHours(16, 0); }
                } else {
                    s = new Date(current_day).setHours(9, 0);
                    // e = new Date(current_day).setHours(17, 0);
                }
            }


            //* HEIKEN-ASHI DATA */
            //* MUST use a consistent start, otherwise the bas change based on the filtered data [0] index */
            //* Viewed data is filtered below - after this calculation! */
            let ohlc_data = calculateHeikinAshi(data/*.filter((v) => v.e >= last_eod.e)*/);

            //* HEIKEN-ASHI CLOSE VALUE (seems to be to fast of an indicator!)
            // let ohlc_data = calculateHeikinAshiClose(data/*.filter((v) => v.e >= s)*/);

            //#region FILTER DATA */
            ohlc_data = ohlc_data
                .filter((v) => v.e >= s)
            // .filter((v) => v.e <= e);
            data = data
                .filter((v) => v.e >= s)
            // .filter((v) => v.e <= e);
            data_m = data_m
                .filter((v) => v.e >= s)
            // .filter((v) => v.e <= e);
            //#endregion


            //#region SEED & START
            const seed = 10 * 1000;

            // let start = data[0].c; //last_eod ? last_eod.c : 0;
            // let start = last_eod ? last_eod.c : data[0].c;
            // let start = Math.min(...(data.filter((v) => v.e >= s).map((v) => v.c)));
            //#endregion

            //#region CALC SHARES
            // const t_400 = data.find((v)=>v.thm === 405);
            // const t_930 = data.find((v)=>v.thm === 930);
            // let start = t_930 ? t_930.c : Math.min(...(data.filter((v) => v.e >= s).map((v) => v.c)));
            // // let start = t_930 ? t_930.c : data[0].c;
            const t_930 = data.find((v) => v.thm === 930);
            let shares = seed / data[0].c;
            const show_full_day = true;
            //#endregion

            //#region LAST & PREVIOUS */
            const last = data[data.length - 1];
            const previous = data[data.length - 2];
            const last_m = data_m[data_m.length - 1];
            const previous_m = data_m[data_m.length - 2];
            //#endregion

            //#region EXTEND OUT CHART FOR CONSISTENT SCALING
            // TODO: /* keep a rolling 8hr window */
            const extend_series = (series) => {

                // if (index === 2) {
                //     series.data = series.data.slice(-90);
                // } else {
                if (show_full_day && hmm < 2001) {
                    const h = Math.ceil(hmm / 100);
                    // const x = new Date(series.data[series.data.length - 1].x).setHours(h, 0);
                    // // const x = hmm < 1200
                    // //     ? new Date(series.data[series.data.length - 1].x).setHours(12, 0)
                    // //     : new Date(series.data[series.data.length - 1].x).setHours(20, 1);
                    const x = new Date(series.data[series.data.length - 1].x).setHours((hmm < 1600 ? /*(hmm < 1100 ? 12 : 16)*/ 16 : 20), 1);
                    series.data.push({ x, y: undefined });
                    // series.data = series.data.filter((v) => hmm > 1600 ? v.x > new Date(x).setHours(9,0) : v.x > (x - (5 * 60 * 60 * 1000)));
                }
                // }
            }
            //#endregion

            //#region MIXED | HA 
            let series = [];
            series.push({ name: 'HA Close', type: 'bar', data: [] });
            series.push({ name: 'Gain', type: 'line', color: colors.black, data: [] });

            //* DATA */
            series[0].data = ohlc_data.map((v, i) => { return { x: v.e, y: round2(v.d * shares) } });
            // extend_series(series[0]);

            let cumulative = 0;
            // series[1].data = ohlc_data.map((v, i) => { cumulative += (v.d * shares); return { x: v.e, y: round2(cumulative) } });
            // series[1].data = ohlc_data.map((v, i) => { /*cumulative += (v.d * shares);*/ return { x: v.e, y: round2(v.c) } });
            series[1].data = data.map((v, i) => { return { x: v.e, y: round2((v.c * shares) - seed) } });
            if (show_full_day && hmm < 2001) {
                // const x = hmm <1200
                //     ? new Date(series[0].data[series[0].data.length - 1].x).setHours(12,0)
                //     : new Date(series[0].data[series[0].data.length - 1].x).setHours(20, 1);
                // series[1].data.push({ x, y: undefined });
                // extend_series(series[1]);
            }
            const y_min = Math.min(...(series[1].data.slice(0, -1).map((v) => v.y)));
            const y_max = Math.max(...series[1].data.slice(0, -1).map((v) => v.y));
            // console.log(y_min, y_max);

            //* ANNOTATIONS */
            this.options_candlestick.annotations.xaxis = annotations_x();
            // this.options_candlestick.annotations.yaxis.push(this.add_annotation_y(last_eod.d, colors.deeppink)),


            //* OTHER OPTIONS */
            this.options_candlestick.stroke.width = [IS_SMALL ? 2.5 : (IS_MEDIUM ? 1.5 : 2), 2];
            this.options_candlestick.yaxis = [
                {
                    seriesName: 'Gain',
                    alignZero: true,
                    axisTicks: { show: true },
                    axisBorder: { show: true, color: '#008FFB' },
                    labels: { style: { colors: '#008FFB' } },
                    title: { text: 'Profit (mixed +/-)', style: { color: '#008FFB' } },
                    // min: y_min > -100 ? -125 : undefined,
                    // max: y_max < 100 ? 125 : undefined,
                },
                {
                    seriesName: 'Close',
                    alignZero: true,
                    opposite: true,
                    axisTicks: { show: false },
                    axisBorder: { show: false, color: '#00E396' },
                    labels: { style: { colors: '#00E396' } },
                    title: { text: 'Units (positive only)', style: { color: '#00E396' } },
                    min: y_min > -100 ? -125 : undefined,
                    max: y_max < 100 ? 125 : undefined,
                },
            ];

            //* FINISH UP */
            delete this.options_candlestick.tooltip.custom;
            this.options_candlestick.chart.type = 'line';
            this.options_candlestick.chart.height = height;
            this.options_candlestick.series = series;
            this._render(this.options_candlestick);
            //#endregion

            //#region MINUTES CHART
            // '#216d24', '#991010', '#4CAF50'
            // '#216d2485'
            // '#1c611e7a'
            series = [];
            series.push({
                name: 'Close',
                type: 'area',
                // color: 'QQQ,^IXIC,^NDX,ETH-USD,^VIX'.split(',').indexOf(symbol) >= 0 ? '#1c611e' : '#4CAF50',
                // color: '#1c611e',
                color: '#4CAF50',
                data: []
            });
            series.push({ name: '0.5 %', type: 'line', data: [] });
            series.push({ name: '-0.5 %', type: 'line', data: [] });
            // series.push({ name: 'Bollinger', type: 'line', color: colors.red, data: [] });

            //* DATA */
            series[0].data = data_m.map((v, i) => { return { x: v.e, y: (v.c * shares) /*- seed*/ } });
            extend_series(series[0]);

            // let add = 1000 * 0.001 / (timeframe === 'day' ? 1 : 0.5);
            // 0.00001 : 0.0001
            let add = seed * (symbol.indexOf('-USD') > 0 || 'QQQ,^IXIC,^NDX,ETH-USD,^VIX'.split(',').indexOf(symbol) >= 0 ? 3 / seed : 10 / seed);
            let increment = series[0].data[0].y;
            let increment_neg = series[0].data[0].y;
            series[1].data = data_m.map((v, i) => { increment += add; return { x: v.e, y: increment } });
            extend_series(series[1]);
            series[2].data = data_m.map((v, i) => { increment_neg -= add; return { x: v.e, y: increment_neg } });
            extend_series(series[2]);

            // const bol = applyBands(series[0].data.map((v)=>{ return {x: v.x, c: v.y} }), 15, 0.5)
            // // console.log(bol);
            // series[1].data = bol.map((v, i) => { return { x: v.x, y: v.bands_c.sma === 0 ? series[0].data[0].y : v.bands_c.sma } });

            //* ANNOTATIONS */
            this.options.annotations.xaxis = annotations_x();
            this.options.annotations.yaxis.push(this.add_annotation_y(series[0].data[series[0].data.length - 2].y, colors.grey));
            this.options.annotations.yaxis.push(this.add_annotation_y(series[0].data[series[0].data.length - 2].y * 1.005, colors.violet));

            //* OTHER OPTIONS */
            this.options.stroke.width = IS_SMALL ? [1, 2, 2] : [1, 2, 2];
            this.options.tooltip.enabledOnSeries = [0, 1, 2];

            //* FINISH UP */
            // this.options.yaxis.max = Math.max(100, Math.max(...series[0].data.map((v) => v.y).slice(0, -1)));
            // this.options.chart.type = 'line';
            this.options.chart.height = height;
            this.options.series = series;
            this._render_m(this.options);
            //#endregion

            //#region SUMMARIES
            const chart_card_series = eval(`CHARTS.CHART_V6_${index}`).options.series[0].data;
            const _last = chart_card_series[chart_card_series.length - (show_full_day ? 2 : 1)].y - seed;
            const _last_minus_1 = chart_card_series[chart_card_series.length - (show_full_day ? 3 : 2)].y - seed;
            const _max = Math.max(...(chart_card_series.slice(0, -1).map((v) => v.y - seed)));
            const _first = chart_card_series[0].y - seed;

            HELPERS.update_elem_text(`chart-card-gain-${index}`, round2(_last - _first), '$', '');
            HELPERS.update_elem_text(`chart-card-pct-${index}`, round1(_last / seed * 100), '', '%');
            HELPERS.update_elem_text_colored(`chart-card-chg-${index}`, round2(_last - _last_minus_1), '', '');

            if (summarize) {

                const account_detail = await ACCOUNT.detail();
                const account_history_5d = await ACCOUNT.history('5D', '1D');
                const account_positions = await ACCOUNT.positions();

                //#region summary cards
                const position_current_value = +(document.getElementById('mobile-card-position').innerText);
                const positions_cost_basis = SHARED.POSITIONS_SUMMARY._TOTAL_.seed;
                const positions_gain = SHARED.POSITIONS_SUMMARY._TOTAL_.gain;
                const positions_gain_pct = SHARED.POSITIONS_SUMMARY._TOTAL_.pct;
                const positions_change = round2(positions_gain - position_current_value);
                const positions_change_pct = round3(positions_change / positions_cost_basis * 100);
                // console.log(position_current_value, positions_gain, positions_change, positions_change_pct);

                HELPERS.update_elem_text_colored(`mobile-card-position`, round1(positions_gain), '', '');
                HELPERS.update_elem_text_colored(`mobile-card-position-pct`, round1(positions_gain_pct), '', '%');
                HELPERS.update_elem_text_colored(`mobile-card-change`, positions_change, '', '');
                HELPERS.update_elem_text_colored(`mobile-card-change-pct`, positions_change_pct, '', '');

                // HELPERS.update_elem_text_colored(`mobile-card-position`, round1(positions_gain), '', '');
                // HELPERS.update_elem_text_colored(`mobile-card-position-pct`, round1(positions_gain_pct), '', '%');
                // HELPERS.update_elem_text_colored(`mobile-card-change`, round1(positions_gain - position_current_value), '', '');
                // HELPERS.update_elem_text_colored(`mobile-card-change-pct`, round2((positions_gain - position_current_value) / positions_cost_basis * 100), '', '');
                //#endregion

                const position = account_positions.find((v) => v.symbol === symbol.replace('-', ''));
                if (position) {
                    document.getElementById(`chart-card-symbol-${index}`).style.color = position.unrealized_pl > 0 ? 'green' : 'red';
                    document.getElementById(`chart-card-symbol-${index}`).style.fontWeight = 'bold';

                    // HELPERS.update_elem_text_colored(`chart-card-gain-${index}`, round2(position.unrealized_pl), '$', '');
                    // HELPERS.update_elem_text_colored(`chart-card-pct-${index}`, round1(position.unrealized_plpc * 100), '', '%');
                    // HELPERS.update_elem_text_colored(`chart-card-chg-${index}`, round2(_last - _last_minus_1), '', '');
                } else {
                    document.getElementById(`chart-card-symbol-${index}`).style.color = 'grey';
                    document.getElementById(`chart-card-symbol-${index}`).style.fontWeight = 'normal';

                }
                // HELPERS.update_elem_text(`chart-card-gain-${index}`, round2(_last - _first), '$', '');
                // HELPERS.update_elem_text(`chart-card-pct-${index}`, round1(_last / seed * 100), '', '%');
                // HELPERS.update_elem_text(`chart-card-chg-${index}`, round2(_last - _last_minus_1), '', '');

                // CONFIG.HA_SYMBOLS.forEach((s, i) => {
                //     const p = ''
                //     const position = account_positions.find((v) => v.symbol === s.replace('-', ''));
                //     if (position) {
                //         document.getElementById(`chart-card-symbol-${i}`).style.color = position.unrealized_pl > 0 ? 'green' : 'red';
                //         document.getElementById(`chart-card-symbol-${i}`).style.fontWeight = 'bold';
                //         document.getElementById(`chart-card-symbol-${i}`).parentElement.style.borderBottom = '1px solid ' + (position.unrealized_pl > 0 ? 'green' : 'red');

                //         HELPERS.update_elem_text_colored(`chart-card-gain-${i}`, round2(position.unrealized_pl), '$', '');
                //         HELPERS.update_elem_text_colored(`chart-card-pct-${i}`, round1(position.unrealized_plpc * 100), '', '%');
                //         HELPERS.update_elem_text_colored(`chart-card-chg-${i}`, round2(_last - _last_minus_1), '', '');
                //     } else {
                //         document.getElementById(`chart-card-symbol-${i}`).style.color = 'grey';
                //         document.getElementById(`chart-card-symbol-${i}`).style.fontWeight = 'normal';
                //         document.getElementById(`chart-card-symbol-${i}`).parentElement.style.borderBottom = '1px solid lightgrey';

                //         // HELPERS.update_elem_text(`chart-card-gain-${i}`, round2(_last - _first), '$', '');
                //         // HELPERS.update_elem_text(`chart-card-pct-${i}`, round1(_last / seed * 100), '', '%');
                //         // HELPERS.update_elem_text(`chart-card-chg-${i}`, round2(_last - _last_minus_1), '', '');
                //     }
                // });

                const account_today_gain = account_detail.equity - account_history_5d[account_history_5d.length - 1].net
                HELPERS.update_elem_text_colored('account-today-gain', round2(account_today_gain), '$', '');
                HELPERS.update_elem_text_colored('account-today-pct', round1((account_today_gain) / CONFIG.DAY_TARGET_DOLLARS * 100), '', '%');


                HELPERS.update_elem_text('account-equity', round(account_detail.equity), '$', '');
                HELPERS.update_elem_text('invested', round(account_detail.buying_power / 1000), '$', 'K');
                HELPERS.update_elem_text_colored('account-delta', round(account_detail.equity - 43500), '$', '');
                HELPERS.update_elem_text_colored('account-pct', round2((account_detail.equity - 43500) / 43500 * 100), '', '%');

                HELPERS.update_elem_text_colored('mobile-card-gain', round(account_today_gain), '', '');
                HELPERS.update_elem_text_colored('mobile-card-pct', round1((account_today_gain) / CONFIG.DAY_TARGET_DOLLARS * 100), '', '%');

                HELPERS.update_elem_text_colored('mobile-card-gain-s', round(account_today_gain), '', '');
                HELPERS.update_elem_text_colored('mobile-card-pct-s', round1((account_today_gain) / CONFIG.DAY_TARGET_DOLLARS * 100), '', '%');

                // HELPERS.update_elem_text_colored(`mobile-card-change`, round2(_last - _last_minus_1), '', '');
                // HELPERS.update_elem_text_colored(`mobile-card-change-pct`, round2((_last - _last_minus_1) / seed * 100), '', '%');

                HELPERS.update_elem_text(`mobile-account-net`, account_detail.equity, '$', '');
                HELPERS.update_elem_text(`mobile-account-buying-power`, account_detail.buying_power, '$', '');



                //#region POSITIONS TREEMAP CHART
                series = [{ name: 'Gain %', type: 'treemap', data: [] }];
                series[0].data = account_positions.map((v, i) => { return { x: v.symbol, y: round1(+(v.unrealized_plpc) * 100) } });
                this.options_treemap.chart.type = 'treemap';
                this.options_treemap.chart.height = IS_SMALL ? 340 : 144;
                // CHART_POSITIONS_TODAY.options.dataLabels.enabled = true;
                // this.options_treemap.xaxis.type = 'category';
                this.options_treemap.dataLabels.formatter = function (text, op) {
                    return [text, op.value]
                };
                this.options_treemap.series = series;
                this._render_t();
                //#endregion
            } else {
                // HELPERS.update_elem_text_colored(`chart-card-chg-${index}`, round2(_last - _last_minus_1), '', '');
            }
            //#endregion

            //#region BUY | SELL INICATION
            // const threshold = 1;
            // const entries = [];
            // this.options_candlestick.series[0].data
            //     .filter((v) => v.y >= threshold)
            //     .forEach((v, i) => {
            //         entries.push({ i, x: HELPERS.getHMM(new Date(v.x)), y: v.y });
            //     });

            // // const v = this.options_candlestick.series[0].data[this.options_candlestick.series[0].data.length - 2].y;
            // // const color = v < 0.25 ? 'red' : '#6dc573';
            // // document.getElementById(`chart-card-banner-${index}`).style.borderBottom = `1px solid ${color}`;
            // // // console.log(`%c${symbol}`, 'color:yellow');
            // // // console.table(entries);

            // // document.getElementById(`chart-card-banner-${index}`).style.borderBottom = `1px solid lightgrey`;

            // const m = 15;
            // document.getElementById(`clock`).style.color = hmm % m === 0 ? `white` : '';
            // document.getElementById(`clock`).parentElement.parentElement.style.border = hmm % m === 0 ? `2px solid white` : '';
            //#endregion

            return;

        } else {
            // console.log('NO DATA');
        }
    }
}
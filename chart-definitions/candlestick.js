//#-------------------------------------------
//# Candlestick Class 
//#-------------------------------------------
class Candlestick {
    chart_instance = null;
    chart_id = null;
    data = null;
    options = {
        series: [{
            data: [
                // {
                //     x: new Date(1538778600000),
                //     y: [6629.81, 6650.5, 6623.04, 6633.33]
                // },
            ]
        }],
        chart: {
            type: 'candlestick',
            height: 550,

            animations: {
                enabled: false,
            },
            toolbar: {
                show: false,
            },
            _sparkline: {
                enabled: true,
            },
        },
        stroke: {
            width: [null, 3, 3, 2],
            colors: [null, colors.blue, colors.orange, colors.lightgrey],
            // fill: { opacity: [1,0.3,1] },
        },
        _title: {
            text: 'CandleStick Chart',
            align: 'left'
        },
        tooltip: {
            // shared: true,
            // custom: [function ({ seriesIndex, dataPointIndex, w }) {
            //     return w.globals.series[seriesIndex][dataPointIndex]
            // }, function ({ seriesIndex, dataPointIndex, w }) {
            //     var o = w.globals.seriesCandleO[seriesIndex][dataPointIndex]
            //     var h = w.globals.seriesCandleH[seriesIndex][dataPointIndex]
            //     var l = w.globals.seriesCandleL[seriesIndex][dataPointIndex]
            //     var c = w.globals.seriesCandleC[seriesIndex][dataPointIndex]
            //     return (
            //         '<div class="apexcharts-tooltip-candlestick">' +
            //         '<div>Open: <span class="value">' +
            //         o +
            //         '</span></div>' +
            //         '<div>High: <span class="value">' +
            //         h +
            //         '</span></div>' +
            //         '<div>Low: <span class="value">' +
            //         l +
            //         '</span></div>' +
            //         '<div>Close: <span class="value">' +
            //         c +
            //         '</span></div>' +
            //         '</div>'
            //     )
            // }],
            x: {
                show: true,
                format: 'dd MMM | h:mm tt',
                style: {
                    fontSize: '21px',
                }
            },
        },
        xaxis: {
            type: 'datetime',
            labels: { datetimeUTC: false, style: { fontSize: '24px' } }
        },
        yaxis: {
            tooltip: {
                enabled: true
            },
            labels: { style: { fontSize: '21px' } }
        },
        annotations: {
            xaxis: [],
            yaxis: [],
            points: [],
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
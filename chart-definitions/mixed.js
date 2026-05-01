const chart_mixed_options = {
    series: [{
        name: '&nbsp;EQUITY',
        type: 'area',
        data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43]
    }, {
        name: '&nbsp;POSITIONS',
        type: 'column',
        data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30]
    },
        // {
        //     name: '&nbsp;DONE',
        //     type: 'line',
        //     data: [0, 0, 0, 0, 0, 0]
        // }
    ],
    chart: {
        height: 350,
        type: 'line',
        stacked: false,
        toolbar: {
            show: false,
        },
        zoom: {
            enabled: false,
        }
    },
    stroke: {
        width: [0, 2, 7, 7],
        curve: 'smooth'
    },
    plotOptions: {
        bar: {
            columnWidth: '50%'
        }
    },
    colors: ['#4caf50', '#2E93fA', '#e08907', '#546E7A', '#66DA26', '#8b026e'], //#4caf50
    fill: {
        opacity: [0.35, 0.65, 1],
        gradient: {
            inverseColors: false,
            shade: 'light',
            type: "vertical",
            opacityFrom: 0.85,
            opacityTo: 0.55,
            _stops: [0, 100, 100, 100]
        }
    },
    labels: ['01/01/2003', '02/01/2003', '03/01/2003', '04/01/2003', '05/01/2003', '06/01/2003', '07/01/2003',
        '08/01/2003', '09/01/2003', '10/01/2003', '11/01/2003'
    ],
    markers: {
        size: 0
    },
    legend: {
        fontSize: '24px',
    },
    xaxis: {
        type: 'category',
        labels: {
            style: {
                fontSize: '24px',
            },
            offsetY: 5,
        }
    },
    yaxis: {
        // title: {
        //     text: 'Points',
        // },
        labels: {
            style: {
                fontSize: '24px',
            },
        }
    },
    tooltip: {
        shared: true,
        intersect: false,
        style: {
            fontSize: '22px',
        },
        // marker: {
        //     show: false,
        // },
        x: {
            show: true,
        },
        y: {
            formatter: function (y) {
                if (typeof y !== "undefined") {
                    return y ? y.toFixed(0) + "" : '';
                }
                return y;

            }
        }
    }

    // var chart = new ApexCharts(document.querySelector("#chart"), options);
    // chart.render();
}
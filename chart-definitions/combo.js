//#-------------------------------------------
//# Combo Class 
//#-------------------------------------------
class Combo {
    chart_instance = null;
    chart_id = null;
    data = null;
    options = {
        series: [],
        chart: {
            height: 350,
            type: 'line',
            stacked: false,
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
            width: [1, 2, 5],
            curve: 'smooth'
        },
        plotOptions: {
            bar: {
                columnWidth: '50%'
            }
        },
        annotations: {
            xaxis: [],
            yaxis: [],
            points: [],
        },
        colors: ['#4CAF50', '#007bf7', '#E91E63', '#445c68', '#FF9800'],
        // _fill: {
        //     opacity: [0.85, 0.25, 1],
        //     gradient: {
        //         inverseColors: false,
        //         shade: 'light',
        //         type: "vertical",
        //         opacityFrom: 0.85,
        //         opacityTo: 0.55,
        //         stops: [0, 100, 100, 100]
        //     }
        // },
        // labels: ['01/01/2003', '02/01/2003', '03/01/2003', '04/01/2003', '05/01/2003', '06/01/2003', '07/01/2003',
        //     '08/01/2003', '09/01/2003', '10/01/2003', '11/01/2003'
        // ],
        markers: {
            size: 0
        },
        legend: {
            show: false,
        },
        xaxis: {
            type: 'datetime',
            labels: {
                style: {
                    fontSize: '24px',
                    // colors: colors.lightgrey,
                }
            }
        },
        yaxis: {
        _title: {
                text: 'Points',
            },
            labels: {
                show: false,
            }
        },
        dataLabels: {
            offsetY: -2.5,
            style: {
                fontSize: '22px',
            },
            background: {
                opacity: 0.1,
                foreColor: colors.grey,
                backgroundColor: colors.white,
            }
        },
        tooltip: {
            shared: true,
            intersect: false,
            style: {
                fontSize: '24px',
            },
            y: {
                // formatter: function (y) {
                //     if (typeof y !== "undefined") {
                //         return y.toFixed(0) + " points";
                //     }
                //     return y;

                // }
            }
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
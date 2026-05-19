let stockChart = null;
function load_advanced_chart() {
    // console.log(RESULTS);
    const chartOptions = {
        chart: {
            height: 700,
        },
        plotOptions: {
            candlestick: {
                xaxis: {
                    labels: {
                        style: {
                            fontSize: '24px', // Change to your desired size
                            fontWeight: 400
                        }
                    }
                },
                tooltip: {
                    style: {
                        fontSize: '24px',
                    },
                },
            }
        },
        series: [
            {
                data: []
                // : [
                //     {
                //         x: "2024-01-01",
                //         y: [100, 101.05, 96.53, 98],
                //         v: 363305,
                //     },
                // ],
            },
        ],
        tooltip: {
            // shared: false,
            // intersect: true,
            // followCursor: false,
            style: {
                fontSize: '24px',
            },
        },
        // textStyle: { fontSize: '28px' },
        xaxis: {
            labels: {
                style: {
                    fontSize: '24px', // Change to your desired size
                    fontWeight: 400
                }
            }
        },
        yaxis: {
            labels: {
                style: {
                    fontSize: '12px',
                    fontWeight: 400
                }
            }
        }
    };

    // Create and render the ApexStock chart
    stockChart = new ApexStock(
        document.querySelector("#chart-bars-analysis"),
        chartOptions
    );
    // stockChart.currentType = 'heikinashi';
    stockChart.render();

    stockChart.updateIndicator("moving average");
    stockChart.updateIndicator("bollinger bands");
    // stockChart.updateIndicator("fibonacci retracements");
    // stockChart.updateIndicator("exponential moving average");
};
function update_advanced_chart(data) {
    // console.log(RESULTS);
    // const chartOptions = {
    //     chart: {
    //         height: 700,
    //     },
    //     series: [
    //         {
    //             data
    //             // : [
    //             //     {
    //             //         x: "2024-01-01",
    //             //         y: [100, 101.05, 96.53, 98],
    //             //         v: 363305,
    //             //     },
    //             // ],
    //         },
    //     ],
    // };

    // Create and render the ApexStock chart
    // const stockChart = document.querySelector("#chart-bars-analysis");
    stockChart.update({ series: [{ data }] });
    stockChart.calculateBollingerBands(0, 7, 0.5);
    // stockChart.calculateFibonacciRetracements(0);
    // stockChart.calculateEMA(0, 7);
};

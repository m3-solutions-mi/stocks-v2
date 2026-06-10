//@ SYMBOL CHART - DAYS */
function update_symbol_chart(chart, data) {
    const raw = INDICATORS.indexOf(name) >= 0;
    let series = [
        { name: 'Close', type: 'area', data: [] },
        { name: 'Open', type: 'line', color: colors.teal, data: [] },
        { name: '0.5% / d', type: 'line', data: [] },
        { name: '1.0% / d', type: 'line', data: [] },
        { name: 'Bollinger', type: 'line', data: [] },
        { name: 'Trendline', type: 'line', data: [] },
    ];
    let start = data[0].c;
    let shares = raw ? 1 : INVEST_AMOUNT / start;
    const increment = (start * shares * 0.005);
    series[0].data = data.map((v, i) => { return { x: new Date(v.t).getTime(), y: (v.c - start) * shares } });
    series[1].data = data.map((v, i) => { return { x: new Date(v.t).getTime(), y: (v.o - start) * shares } });
    if (!raw) {
        series[2].data = data.map((v, i) => { return { x: new Date(v.t).getTime(), y: (i * increment) } });
        series[3].data = data.map((v, i) => { return { x: new Date(v.t).getTime(), y: (i * increment * 2) } });
    }
    // series[1].data = data.map((v, i) => { return { x: new Date(v.t).getTime(), y: (i * increment) } });
    // series[2].data = data.map((v, i) => { return { x: new Date(v.t).getTime(), y: (i * increment * 2) } });
    const bollinger = calculateBollingerBands(series[0].data.map((v) => v.y), 7, 1);
    series[0].data.forEach((v, i) => {
        series[4].data.push({ x: v.x, y: bollinger.lowerBand[i] });
    });
    const tl = calculateTrendline(series[0].data.map((v) => v.y));
    series[0].data.forEach((v, i) => {
        series[5].data.push({ x: v.x, y: tl.calculateY(i) });
    });
    // console.log('score','|', round1(tl.slope - increment));
    chart.options.tooltip.enabledOnSeries = [0];
    chart.options.annotations.xaxis = [];
    let n = new Date(series[0].data[0].x).getFullYear();
    series[0].data.forEach((v) => {
        const n2 = new Date(v.x).getFullYear();
        if (n !== n2) {
            CHART_SYMBOL.options.annotations.xaxis.push(add_annotation_x(v.x));
        }
        n = n2;
    })
    // CHART_SYMBOL.options.yaxis.min = Math.min(...series[0].data.map((v)=>v.y));
    chart.options.chart.height = 380;
    chart.options.series = series;
    chart.render();
}
//@ SYMBOL CHART - 24H */
function update_symbol_chart_24h(chart, data, height = 225) {
    if (active_page === 'compare' || active_page === 'mobile') {
        const raw = INDICATORS.indexOf(name) >= 0;
        let series = [
            { name: 'Close', type: 'area', data: [] },
        ];
        let start = data[0].c;
        let shares = raw ? 1 : INVEST_AMOUNT / start;
        series[0].data = data.map((v, i) => { return { x: new Date(v.t).getTime(), y: (v.c) * shares } });
        chart.options.tooltip.enabledOnSeries = [0];
        chart.options.annotations.xaxis = [];
        chart.options.annotations.yaxis = [];
        const d3 = series[0].data[series[0].data.length - 1].x;
        const d2 = d3 - (24 * 60 * 60 * 1000);
        const d1 = d3 - (2 * 24 * 60 * 60 * 1000);
        const add_shade = (e, o = 0.25) => {
            chart.options.annotations.xaxis[chart.options.annotations.xaxis.length - 1].x2 = e;
            chart.options.annotations.xaxis[chart.options.annotations.xaxis.length - 1].opacity = o;
        }
        chart.options.annotations.xaxis.push(add_annotation_x(new Date(d3).setHours(0, 0), null, colors.gray));
        add_shade(new Date(d3).setHours(9, 30), 0.1);
        chart.options.annotations.xaxis.push(add_annotation_x(new Date(d3).setHours(9, 30), null, colors.lightgrey));
        // add_shade(new Date(d3).setHours(16,0),0.075);
        chart.options.annotations.xaxis.push(add_annotation_x(new Date(d3).setHours(10, 0), null, colors.deeppink));
        chart.options.annotations.xaxis.push(add_annotation_x(new Date(d3).setHours(10, 30), null, colors.teal));
        chart.options.annotations.xaxis.push(add_annotation_x(new Date(d3).setHours(11, 30), null, colors.lightgrey));
        chart.options.annotations.xaxis.push(add_annotation_x(new Date(d3).setHours(16, 0), null, colors.darkgray));
        chart.options.annotations.xaxis.push(add_annotation_x(new Date(d3).setHours(16, 0), null, colors.gray));
        add_shade(new Date(d3).setHours(20, 0), 0.1);
        // chart.options.annotations.xaxis.push(add_annotation_x(new Date(d3).setHours(10, 0), null, colors.lightgrey));
        // chart.options.annotations.xaxis.push(add_annotation_x(new Date(d2).setHours(4, 0), null, colors.grey));
        // chart.options.annotations.xaxis.push(add_annotation_x(new Date(d2).setHours(10, 0), null, colors.teal));
        // chart.options.annotations.xaxis.push(add_annotation_x(new Date(d2).setHours(10, 30), null, colors.orange));
        // chart.options.annotations.xaxis.push(add_annotation_x(new Date(d2).setHours(15, 30), null, colors.orange));
        chart.options.annotations.xaxis.push(add_annotation_x(new Date(d2).setHours(4, 0), null, colors.darkgray));
        chart.options.annotations.xaxis.push(add_annotation_x(new Date(d2).setHours(9, 30), null, colors.teal));
        add_shade(new Date(d2).setHours(16, 0), 0.075);
        chart.options.annotations.xaxis.push(add_annotation_x(new Date(d2).setHours(16, 0), null, colors.deeppink));
        // chart.options.annotations.xaxis.push(add_annotation_x(new Date(d2).setHours(16, 0), null, colors.lightgrey));
        // add_shade(20,0);
        // chart.options.annotations.xaxis.push(add_annotation_x(new Date(d1).setHours(15, 30), null, colors.orange));
        chart.options.annotations.xaxis.push(add_annotation_x(new Date(d1).setHours(4, 0), null, colors.darkgray));
        chart.options.annotations.xaxis.push(add_annotation_x(new Date(d1).setHours(9, 30), null, colors.lightgrey));
        add_shade(new Date(d1).setHours(16, 0), 0.075);
        chart.options.annotations.yaxis.push(add_annotation_y(series[0].data[series[0].data.length - 1].y, colors.grey));
        chart.options.chart.height = height;
        chart.options.series = series;
        chart.render();
    }
}
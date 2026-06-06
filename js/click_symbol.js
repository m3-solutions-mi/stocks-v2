async function click_symbol(name) {

    SELECTED_SYMBOL = name;
    const raw = INDICATORS.indexOf(name) >= 0; //false; //INDICATORS.indexOf(name) >= 0;
    const position = RESULTS?.POSITIONS ? RESULTS.POSITIONS.find((v) => v.name === name) : null;
    // console.log(position);

    const data = await get_symbol_data_days(name);
    const data_m = await get_symbol_data_24h(name);


    const update_data_bars_advanced = () => {
        //* BARS ANALYSIS CHARTS */
        const num = INVEST_AMOUNT / data[0].o;
        const increment = (data[0].o * num * 0.0075);
        const increment_2 = (data[0].o * num * 0.0125);
        const increment_3 = (data[0].o * num * 0.02);
        // series[0].data = data.map((v, i) => { return { x: new Date(v.t).getTime(), y: (v.c - start) * shares } });
        // if (!raw) {
        //     series[1].data = data.map((v, i) => { return { x: new Date(v.t).getTime(), y: (i * increment) } });
        //     series[2].data = data.map((v, i) => { return { x: new Date(v.t).getTime(), y: (i * increment * 2) } });
        // }
        let data_bars_advanced = data.map((v) => { return { x: getYMD(new Date(v.t)), y: [v.o * num, v.h * num, v.l * num, v.c * num] } });
        // console.log(data_bars_advanced);
        // update_advanced_chart(data_bars_advanced);
        let ha = calculateHeikinAshi(data_bars_advanced.map((v) => { return { o: v.y[0], h: v.y[1], l: v.y[2], c: v.y[3] }; }));
        let bb = calculateBollingerBands(data_bars_advanced.map((v) => v.y[3]), period = 7, multiplier = 0.5);
        CHART_BARS_ANALYSIS_OHLC.options.series = [
            { name: name, data: ha.map((v, i) => { return { x: data_bars_advanced[i].x, y: [v.o, v.h, v.l, v.c] } }) },
            { name: 'Bollinger', type: 'line', data: bb.lowerBand.map((v, i) => { return { x: data_bars_advanced[i].x, y: v === 0 ? ha[i].c : round2(v) } }) },
            { name: 'Upper', type: 'line', data: bb.upperBand.map((v, i) => { return { x: data_bars_advanced[i].x, y: v === 0 ? ha[i].c : round2(v) } }) },
            { name: '0.75%', type: 'line', color: colors.lightgrey, data: data.map((v, i) => { return { x: new Date(v.t).getTime(), y: (i * increment) + INVEST_AMOUNT } }) },
            { name: '1.25%', type: 'line', color: colors.teal, data: data.map((v, i) => { return { x: new Date(v.t).getTime(), y: (i * increment_2) + INVEST_AMOUNT } }) },
            // { name: '2.0%', type: 'line', color: colors.teal, data: data.map((v, i) => { return { x: new Date(v.t).getTime(), y: (i * increment_3) + INVEST_AMOUNT } }) },
        ];
        CHART_BARS_ANALYSIS_OHLC.options.chart.height = 500;
        CHART_BARS_ANALYSIS_OHLC.render();
        //  (${round2((data_bars_advanced[data_bars_advanced.length-1][3].y-data_bars_advanced[0][3].y)/data_bars_advanced[0][3].y*100)}%)
        const qty = INVEST_AMOUNT / data_bars_advanced[0].y[3];
        const gain_window = round2((data_bars_advanced[data_bars_advanced.length - 1].y[3] - data_bars_advanced[0].y[3]) * qty);
        const gain_week = round2((data_bars_advanced[data_bars_advanced.length - 1].y[3] - data_bars_advanced[data_bars_advanced.length - 4].y[0]) * qty);
        document.getElementById('chart-bars-analysis-title').innerHTML = `<b class="w3-text-grey">${name}</b>`;
        document.getElementById('chart-bars-analysis-title-description').innerHTML = `&nbsp;&nbsp;|&nbsp;&nbsp;<span class="w3-xlarge w3-text-grey">${get_description(name)}</span>`;
        document.getElementById('chart-bars-analysis-title-description').innerHTML += `&nbsp;&nbsp;|&nbsp;&nbsp;<b><span class="w3-xlarge w3-text-${gain_window >= 0 ? 'green' : 'red'}">$ ${gain_window.toLocaleString()}</span></b>`;
        document.getElementById('chart-bars-analysis-title-description').innerHTML += `&nbsp;&nbsp;|&nbsp;&nbsp;<b><span class="w3-xlarge w3-text-${gain_week >= 0 ? 'green' : 'red'}">$ ${gain_week.toLocaleString()}</span></b>`;

        // data_bars_advanced = data_m.map((v) => { return { x: new Date(v.t).getTime(), y: [v.o, v.h, v.l, v.c] } });
        // // console.log(data_bars_advanced);
        // // update_advanced_chart(data_bars_advanced);
        // ha = calculateHeikinAshi(data_bars_advanced.map((v) => { return { o: v.y[0], h: v.y[1], l: v.y[2], c: v.y[3] }; }));
        // bb = calculateBollingerBands(data_bars_advanced.map((v) => v.y[3]), period = 7, multiplier = 0.5);
        // CHART_BARS_ANALYSIS_OHLC_M.options.series = [
        //     { name: name, data: ha.map((v, i) => { return { x: data_bars_advanced[i].x, y: [v.o, v.h, v.l, v.c] } }) },
        //     // { name: 'Close', type: 'area', color: '#4CAF5030', data: bb.lowerBand.map((v, i) => { return { x: data_bars_advanced[i].x, y: data_bars_advanced[i].y } }) },
        //     // { name: 'Upper', type: 'line', data: bb.upperBand.map((v, i) => { return { x: data_bars_advanced[i].x, y: v === 0 ? ha[i].c : round2(v) } }) },
        // ];
        // CHART_BARS_ANALYSIS_OHLC_M.options.annotations = { xaxis: [], yaxis: [], points: [] };
        // CHART_BARS_ANALYSIS_OHLC_M.options.annotations.yaxis.push(add_annotation_y(data_bars_advanced[0].y[3], 'blue', `Start: $${data_bars_advanced[0].y[3]}`));
        // CHART_BARS_ANALYSIS_OHLC_M.options.annotations.yaxis.push(add_annotation_y(data_bars_advanced[data_bars_advanced.length - 1].y[3], 'deeppink', `Start: $${data_bars_advanced[data_bars_advanced.length - 1].y[3]}`));

        // const d = new Date(data_bars_advanced[data_bars_advanced.length - 1].x);
        // // console.log(d2);
        // CHART_BARS_ANALYSIS_OHLC_M.options.annotations.xaxis = [
        //     add_annotation_x(d.setHours(16, 0) - (24 * 60 * 60 * 1000), null, colors.teal),
        //     add_annotation_x(d.setHours(20, 0) - (24 * 60 * 60 * 1000), null, colors.teal),
        //     add_annotation_x(d.setHours(9, 30), null, colors.teal),
        //     add_annotation_x(d.setHours(10, 30), null, colors.lightgrey),
        //     add_annotation_x(d.setHours(10, 0), null, colors.deeppink),
        //     add_annotation_x(d.setHours(10, 30), null, colors.lightgrey),
        //     add_annotation_x(d.setHours(16, 0), null, colors.teal),
        // ];
        // // CHART_BARS_ANALYSIS_OHLC_M.options.annotations.xaxis.push(add_annotation_x(data_bars_advanced.find((v)=>v.x >= data_bars_advanced[0]).x.setHours(9,25), 'blue'));
        // // CHART_BARS_ANALYSIS_OHLC_M.options.chart.sparkline = { enabled: true };
        // CHART_BARS_ANALYSIS_OHLC_M.options.yaxis = { show: false };
        // CHART_BARS_ANALYSIS_OHLC_M.render();
    }
    update_data_bars_advanced();


    update_symbol_chart(CHART_SYMBOL, data);
    const series = CHART_SYMBOL.options.series

    let clone = deepClone(CHART_SYMBOL.options);
    clone.chart.height = 275;
    CHART_PDT_SYMBOL_DAYS.options = clone;
    CHART_PDT_SYMBOL_DAYS.render();

    const num = -14
    const series_2 = deepClone(series);
    series_2[0].data = series[0].data.slice(num);
    series_2[1].data = series[1].data.slice(num);
    series_2[2].data = series[2].data.slice(num);
    series_2[3].data = series[3].data.slice(num);
    series_2[4].data = series[4].data.slice(num);
    series_2[5].data = series[5].data.slice(num);
    CHART_SYMBOL_RECENT.options.tooltip.enabledOnSeries = [0, 1];
    CHART_SYMBOL_RECENT.options.chart.height = 325;
    CHART_SYMBOL_RECENT.options.series = series_2;
    CHART_SYMBOL_RECENT.render();

    clone = deepClone(CHART_SYMBOL_RECENT.options);
    clone.chart.height = 215;
    CHART_PDT_SYMBOL_DAYS_RECENT.options = clone;
    CHART_PDT_SYMBOL_DAYS_RECENT.render();

    clone.chart.height = 510;
    clone.annotations.yaxis.push(add_annotation_y(series_2[0].data[series_2[0].data.length - 1].y));
    CHART_BARS_ANALYSIS_OHLC_M.options = clone;
    CHART_BARS_ANALYSIS_OHLC_M.render();

    let series_3 = deepClone(series);
    start = data_m[0].c;
    shares = raw ? 1 : INVEST_AMOUNT / start;
    series_3 = [{ name: 'Gain', type: 'area', data: [] },]
    series_3[0].data = data_m.map((v, i) => { return { x: new Date(v.t).getTime(), y: (v.c) * shares } });
    // series[1].data = data_m.map((v, i) => { return { x: new Date(v.t).getTime(), y: (i * increment) } });
    // series[2].data = data_m.map((v, i) => { return { x: new Date(v.t).getTime(), y: (i * increment * 2) } });
    let d1 = new Date(series[0].data[series[0].data.length - 1].x);
    const d2 = new Date(series[0].data[series[0].data.length - 1].x - (24 * 60 * 60 * 1000));
    // console.log(d2);
    CHART_SYMBOL_MINUTES.options.annotations.xaxis = [
        add_annotation_x(d1.setHours(9, 30), null, colors.darkcyan),
        add_annotation_x(d1.setHours(9, 30), '9:30', colors.deeppink,),
        add_annotation_x(d1.setHours(10, 0), null, colors.grey),
        add_annotation_x(d1.setHours(10, 30), null, colors.teal),
        add_annotation_x(d1.setHours(15, 25), null, colors.darkcyan),
        add_annotation_x(d1.setHours(16, 0), null, colors.grey),
        add_annotation_x(d1.setHours(20, 0), null, colors.grey),

        add_annotation_x(d2.setHours(9, 30), null, colors.darkcyan),
        add_annotation_x(d2.setHours(10, 0), null, colors.darkcyan),
        add_annotation_x(d2.setHours(10, 30), null, colors.lightgrey),
        add_annotation_x(d2.setHours(15, 30), null, colors.darkcyan),
        add_annotation_x(d2.setHours(16, 0), null, colors.grey),
    ];
    CHART_SYMBOL_MINUTES.options.annotations.xaxis[0].x2 = d1.setHours(10, 0);
    CHART_SYMBOL_MINUTES.options.annotations.xaxis[0].opacity = 0.1;
    CHART_SYMBOL_MINUTES.options.annotations.xaxis[4].x2 = d1.setHours(16, 0);
    CHART_SYMBOL_MINUTES.options.annotations.xaxis[4].opacity = 0.1;
    CHART_SYMBOL_MINUTES.options.annotations.yaxis = [add_annotation_y(series_3[0].data[series_3[0].data.length - 1].y)];
    CHART_SYMBOL_MINUTES.options.chart.height = 150;
    CHART_SYMBOL_MINUTES.options.series = series_3;
    CHART_SYMBOL_MINUTES.render();

    clone = deepClone(CHART_SYMBOL_MINUTES.options);
    clone.chart.height = 375;

    // let sod = clone.series[0].data.find((v) => v.x >= new Date(clone.series[0].data[clone.series[0].data.length - 1].x).setHours(4, 0));
    // let eod = clone.series[0].data.find((v) => sod.x && v.x >= new Date(clone.series[0].data[clone.series[0].data.length - 1].x).setHours(9, 59));
    // clone.annotations.xaxis[1] = add_annotation_x(d1.setHours(10, 0), `$ ${round2((eod.y || 0) - (sod.y || 0)).toString()}`, colors.grey);

    // sod = clone.series[0].data.find((v) => v.x >= new Date(clone.series[0].data[clone.series[0].data.length - 1].x).setHours(15, 25));
    // eod = clone.series[0].data.find((v) => sod.x && v.x >= new Date(clone.series[0].data[clone.series[0].data.length - 1].x).setHours(15, 59));
    // clone.annotations.xaxis[3] = add_annotation_x(d1.setHours(16, 0), `$ ${round2((eod.y || 0) - (sod.y || 0)).toString()}`, colors.grey);
    CHART_PDT_TODAY.options = clone;
    CHART_PDT_TODAY.render();

    //*  */
    clone = deepClone(CHART_SYMBOL_MINUTES.options);
    clone.chart.height = 250;
    CHART_BARS_ANALYSIS_TODAY.options = clone;
    CHART_BARS_ANALYSIS_TODAY.render();


    const buy_at = new Date(series_3[0].data[series_3[0].data.length - 1].x).setHours(11, 0, 0, 0);
    const sell_at = new Date(series_3[0].data[series_3[0].data.length - 1].x).setHours(15, 50, 0, 0);
    const value_start = series_3[0].data.find((v) => v.x >= buy_at)?.y | 0;
    const value_end = series_3[0].data.find((v) => v.x >= sell_at)?.y | 0; //series_3[0].data[series_3[0].data.length - 1].y;
    const g = value_end - value_start;
    // console.log(round2(value_start), round2(value_end), round2(g));

    const last = round2(series_3[0].data[series_3[0].data.length - 1].y);
    const min = round2(Math.min(...(series_3[0].data.map((v) => v.y))));
    const max = round2(Math.max(...(series_3[0].data.map((v) => v.y))));
    const swing = round2(max - min);
    const mid = round2((max + min) / 2);
    // console.log(last, min, max, '|', swing, mid);


    document.getElementById('pdt-today-title').innerHTML = `<b>${name}</b>&nbsp;&nbsp;|&nbsp;&nbsp;${get_description(name)}`;
    document.getElementById('pdt-today-title-day').innerHTML = `$ ${round2(series_3[0].data[series_3[0].data.length - 1].y - series_3[0].data[0].y)}`;
    // document.getElementById('analysis-buying-power').innerHTML = RESULTS ? '$ ' + round(RESULTS.ACCOUNT.buying_power).toLocaleString() : '-';

    const g_days = series[0].data[series[0].data.length - 1].y - series[0].data[0].y
    document.getElementById('symbol-chart-recent-title').innerHTML = `<b>${name}</b>`;
    document.getElementById('symbol-chart-title').innerHTML = `<b>${name}</b> | ${get_description(name).slice(0, 45)}`;
    document.getElementById('symbol-chart-title').innerHTML += `<div class="w3-right w3-wide ${g_days >= 0 ? 'w3-text-green' : 'w3-text-red'}" style="width:180px;">$&nbsp;${round2(g_days)}</div>`;
    // document.getElementById('symbol-chart-title').innerHTML += `<div class="w3-right w3-text-blue" style="width:120px;">$ ${position ? position.seed : '-'}</div>`;

    document.getElementById('symbol-chart-day-title').innerHTML = `<b>$ ${last}&nbsp;&nbsp;&nbsp;&nbsp;<span class="w3-wide w3-text-grey">$&nbsp;${swing} | </span><span class="w3-text-grey w3-xxlarge">${round1(last - max)}</span></b>`;
    document.getElementById('symbol-chart-day-title').innerHTML += `<div class="w3-right w3-text-blue w3-wide" style="_width:150px;"></div>`;

    // document.getElementById('symbol-chart-day-title').innerHTML = `<b>Day&nbsp;&nbsp;&nbsp;&nbsp;<span class="w3-wide ${g > 0 ? 'w3-text-green' : 'w3-text-red'}">$&nbsp;${round2(g)}</span>&nbsp;&nbsp;&nbsp;&nbsp;<span class="w3-text-grey w3-xlarge">${round1(g / 1000 * 100)} %</span></b>`;
    // document.getElementById('symbol-chart-day-title').innerHTML += `<div class="w3-right w3-text-blue w3-wide" style="_width:150px;"></div>`;

    //* UPDATE DETAIL CARD */
    // console.log(position);
    document.getElementById('symbol-gain').innerHTML = position ? '$ ' + position.gain : '-';
    document.getElementById('symbol-gain-pct').innerHTML = position ? position.gain_pct + ' %' : '-';
    document.getElementById('symbol-today').innerHTML = position ? '$ ' + position.day : '-';
    document.getElementById('symbol-today-pct').innerHTML = position ? position.day_pct + ' %' : '-';
    // document.getElementById('symbol-score').innerHTML = round1(tl.slope);
    // document.getElementById('symbol-score-baseline').innerHTML = round1(increment);
    document.getElementById('symbol-invested').innerHTML = position ? '$ ' + position.seed : '-';
    document.getElementById('analysis-buying-power').innerHTML = RESULTS ? '$ ' + round(RESULTS.ACCOUNT.buying_power).toLocaleString() : '-';
    document.getElementById('bars-analysis-buying-power').innerHTML = RESULTS ? '$ ' + round(RESULTS.ACCOUNT.buying_power).toLocaleString() : '-';
    document.getElementById('pdt-buying-power').innerHTML = RESULTS ? '$ ' + round(RESULTS.ACCOUNT.buying_power).toLocaleString() : '-';
    document.getElementById('compare-buying-power').innerHTML = RESULTS ? '$ ' + round(RESULTS.ACCOUNT.buying_power).toLocaleString() : '-';

    // document.getElementById('chart-symbol-recent').scrollIntoView();
}
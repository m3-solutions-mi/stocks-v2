let RESULTS = null;
// const CHART_DAY_HISTORY = new Treemap('CHART_DAY_HISTORY');
// const CHART_24H_HISTORY = new Treemap('CHART_24H_HISTORY');
const CHART_POSITIONS = new Treemap('chart-positions');
const CHART_POSITIONS_TODAY = new Treemap('chart-positions-today');
const CHART_SYMBOL = new Treemap('chart-symbol');
const CHART_SYMBOL_RECENT = new Treemap('chart-symbol-recent');
const CHART_SYMBOL_MINUTES = new Treemap('chart-symbol-minutes');
const CHART_TREND = new Combo('chart-trend');
const CHART_PDT_RECENT = new Treemap('chart-pdt-chart-symbol-recent');
const CHART_PDT_TODAY = new Treemap('chart-pdt-chart-symbol-day');
const CHART_PDT_TODAY_TREE = new Treemap('chart-pdt-day-tree');
const CHART_PDT_ACCOUNT = new Treemap('chart-pdt-account-today');
const CHART_PDT_SYMBOL_DAYS = new Treemap('chart-pdt-symbol-days');
const CHART_PDT_SYMBOL_DAYS_RECENT = new Treemap('chart-pdt-symbol-days-recent');
const CHART_TOP_SYMBOLS = new Treemap('chart-top-symbols');
const CHART_TOP_SYMBOLS_LAST = new Treemap('chart-top-symbols-last');
const CHART_BARS_ANALYSIS_OHLC = new Candlestick('chart-bars-analysis-ohlc');
const CHART_BARS_ANALYSIS_OHLC_M = new Treemap('chart-bars-analysis-ohlc-m');
const CHART_BARS_ANALYSIS_TODAY = new Treemap('chart-bars-analysis-today');
const CHART_BARS_ANALYSIS_ACCOUNT = new Treemap('chart-bars-analysis-account');
const CHART_BARS_ANALYSIS_POSITIONS = new Treemap('chart-bars-analysis-positions');

const CHART_MOBILE_FUTURES = new Treemap('chart-mobile-futures');
const CHART_MOBILE_OIL = new Treemap('chart-mobile-oil');
const CHART_MOBILE_VIX = new Treemap('chart-mobile-vix');
const CHART_MOBILE_ACCOUNT = new Treemap('chart-mobile-account');

compare_charts_map = {};
'CHART_DAY_HISTORY,CHART_24H_HISTORY'.split(',').forEach((v) => {
    compare_charts_map[v] = new Treemap(v);
})
''.split(',').forEach((v) => {
    compare_charts_map[v] = new Combo(v);
})
for (let x = 1; x <= 45; x++) {
    const v = `chart-compare-${x}`;
    compare_charts_map[v] = new Treemap(v);
}

async function load_data() {

    const promises = [
        // `http://localhost:3000/wrm/v1/csv/ama/2026-04-17`,
        // `https://m3-solutions-mi.com/CL=F/1d/2026-03-13T23:59:59/2027-01-01`,
        // `https://m3-solutions-mi.com/^IXIC/1d/2026-03-13T23:59:59/2027-01-01`,
        // `https://m3-solutions-mi.com/^VIX/1d/2026-03-13T23:59:59/2027-01-01`,
        // `https://api.alpaca.markets/v2/positions`
        // `https://paper-api.alpaca.markets/v2/positions`
    ].map((v) => fetch(v, {}).then((resp) => resp.json()));

    [
        `https://api.alpaca.markets/v2/positions`,
        `https://api.alpaca.markets/v2/account`,
        // `https://api.alpaca.markets/v2/account/activities?category=non_trade_activity&direction=desc&page_size=100`,
        `https://api.alpaca.markets/v2/account/activities/CSD?direction=desc&page_size=100`, //* ONLY CASH DEPOSITS - CSW for Cash Withdrawals */
        `https://api.alpaca.markets/v2/account/portfolio/history?period=14D&timeframe=1D&intraday_reporting=extended_hours&pnl_reset=per_day`,
        `https://api.alpaca.markets/v2/account/portfolio/history?period=1D&timeframe=1Min&intraday_reporting=extended_hours&pnl_reset=per_day`,
        `https://api.alpaca.markets/v2/orders?status=all&limit=1000&direction=desc`
        // `https://api.alpaca.markets/v2/account/portfolio/history?start=2026-04-19&timeframe=1Min&intraday_reporting=continuous&pnl_reset=per_day`
    ].forEach((v) => {
        promises.push(fetch(v, {
            method: 'GET',
            headers: {
                accept: 'application/json',
                'APCA-API-KEY-ID': ALPACA_KEY,
                'APCA-API-SECRET-KEY': ALPACA_SECRET,
            }
        }).then(res => res.json()));
    });
    // promises.push(fetch(`https://m3-solutions-mi.com/CL=F/1Min/2026-04-18T23:59:59/2027-01-01`, {}).then((resp) => resp.json()))

    const d = new Date();
    let results = await Promise.allSettled(promises);//.map((v)=>v.value);
    results = results.map((v) => v.value);
    RESULTS = {
        // DAY_TABLE: results[0],
        // // OIL: results[1],
        // // NASDAQ: results[2],
        // // VIX: results[3],
        POSITIONS_RAW: results[0],
        ACCOUNT: results[1],
        ACTIVITIES: results[2],
        ORDERS: results[5],
        HISTORY_1W_DAY: results[3],
        HISTORY_1D_MIN: results[4],
    }
    RESULTS.POSITIONS = results[0].map((v) => {
        const description = get_description(v.symbol);
        const buys = RESULTS.ORDERS
            .filter((v2) => v2.side === 'buy')
            .filter((v2) => v2.symbol === v.symbol);
        const buy_date = getYMD(buys[0].filled_at, false);
        return {
            name: v.symbol,
            description,
            date: buy_date,
            seed: round(v.cost_basis),
            gain: round2(v.unrealized_pl),
            gain_pct: round2(v.unrealized_plpc * 100),
            day: round2(v.unrealized_intraday_pl),
            day_pct: round2(v.unrealized_intraday_plpc * 100),
        }
    }),
        RESULTS.CALCS = {
            EQUITY: +(RESULTS.ACCOUNT.equity),
            TODAY: round2(RESULTS.ACCOUNT.equity - RESULTS.HISTORY_1W_DAY.equity[RESULTS.HISTORY_1W_DAY.equity.length - 1]),
            INVESTED: round2(RESULTS.ACTIVITIES.filter((v) => v.activity_type === 'CSD').map((v) => +(v.net_amount)).reduce((p, c) => p + c)),
            NUM_POSITIONS: RESULTS.POSITIONS.length,
        }
    RESULTS.CALCS.GAIN = round2(RESULTS.CALCS.EQUITY - RESULTS.CALCS.INVESTED);
    // const dow = new Date().getDay();
    // RESULTS.CALCS.TARGET = dow !== 6 && dow !== 0 ? (RESULTS.CALCS.INVESTED * 0.0075) : 0;
    RESULTS.CALCS.TARGET = RESULTS.CALCS.INVESTED * 0.0075;
    RESULTS.CALCS.DELTA = RESULTS.CALCS.TODAY - round2(RESULTS.CALCS.TARGET);
    RESULTS.DEPOSITS = analyze_account_2();
    RESULTS.TREND = await get_trend();
    // RESULTS.TOP_MOVERS = await get_all_symbols();

    console.log(d.toLocaleTimeString(), '|', RESULTS.CALCS.GAIN, '|', RESULTS.CALCS.TODAY);
    // console.log(RESULTS.CALCS);
    // console.log(RESULTS);
    results = null;

    const add_letters = () => {
        const template = `<div class="w3-button" style="width:50px;" onclick=(click_letter("{0}"))>{0}</div>`;
        let html = '';
        // ,⏺,🔎︎,▶,⏸
        'A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z'.split(',').forEach((letter) => {
            // html += template.replace('{id}', letter).replace('{c}', 'white').replace('{0}', letter).replace('{1}', '').replace('{s}', letter).replace('{f}', 'click_letter') + '\n';
            html += template
                .replace('{0}', letter)
                .replace('{0}', letter);
        });
        // html += `<i class="fa fa-filter w3-right w3-margin-right w3-xlarge w3-text-blue" aria-hidden="true"></i>`;
        document.getElementById('letters').innerHTML = html;
    }
    add_letters();

    let symbol_list = 'AAOI,AIS,ALAB,ALAB,AMD,ARM,AMZN,AVGO,AVT,AXTI,BE,BTSG,BTSG,BTSG,CAT,CIFR,COHR,CRDO,CRWD,CSCO,DDOG,DELL,DELL,DIOD,DRAM,GOOGL,GOOGL,HTLD';
    symbol_list += ',INTC,IREN,KOPN,MCHP,MDB,MRVL,MPWR,MTSI,MTSI,MU,NBIS,NBIS,NVDA,ON,PENG,PENG,PLUG,PLUG,POWL,RKLB,RKLB,ROKU';
    symbol_list += ',SITM,SMCI,SMH,SNDK,SOXL,SOXX,STRL,STX,SYM,TER,TSEM,TSEM,TSM,UMC,UMC,VIAV,VRT,VRT,VSAT,WDC,WOLF,WOLF,WLDN,WULF';

    let watch_list = [...('AMAT,ASML,BTSG,HTLD,KLAC,LRCX,WLDN'.split(',')), ...symbol_list.split(',').sort()];
    watch_list = watch_list.filter((v, i, a) => a.indexOf(v) === i).filter((v) => v !== '-');
    watch_list.push(...INDICATORS, 'COMB');

    const highlight_grey = '-'.split(',').sort();
    const highlight_green = '-'.split(','); //.sort();
    const highlight_orange = 'HTLD,WLDN'.split(',').sort();
    // const highlight_blue = 'BTSG,CRWD,DDOG,MU,UMC,WOLF'.split(',').sort();
    const highlight_blue = 'KLAC,LRCX,AMAT,ASML,BTSG,WLDN'.split(',').sort();
    const highlight_purple = '-'.split(',').sort();
    const highlight_pink = 'NQ=F,QQQ,QQQI,NDAQ,CL=F,^VIX'.split(',').sort();
    const highlight_black = 'COMB'.split(',').sort();
    const add_watch_list = () => {
        // let watch_list = 'TNGX,TIGO,TIGR,TSEM,SWMR,SNDK,SMCI,SOXL,STRL,STX,MU,KOPN,UNH,NAUT,NEO,ATOM,MSTR,MDB'
        // watch_list += ',BLDP,BAER,CIFR,COIN,CRWD,CRWV,CORZ,CECO,DHC,POWL,ALNT,CAT,GEV,WDC,GE';
        // watch_list += ',CNC,DIOD,DRAM,VRT,VSAT,TER,GNRC,KOD,SMTC,GOOGL,HOOD,HUT,SITM,ORKA,INTC,MCHP,AEIS,MPWR,ON,AVGO';
        // watch_list += ',BE';
        // const highlight_grey = 'BE,CAT,CIFR,CLSK,DHC,GOOGL,HOVR,IREN,MSTR,OKLO,PLTR,QCOM,TEAM,VCX'.split(',').sort();

        // const removed = 'CCX,CRWV,FIX,GEV,HGER,HOOD,IGV,INTU,KNSA,LITE,LITE,SMCI';


        const template = `<div class="w3-button w3-center w3-margin-right" style="margin-bottom:10px;border-bottom:{1}px solid {2} !important;border:2px solid lightgrey;width:120px;" onclick=(click_symbol("{0}"))>{0}</div>`;
        const template_pdt = `
                    <tr style="cursor:pointer;" onclick="click_symbol(Array.from(this.children)[0].innerText)">
                        <td><i class="fa fa-circle{5} w3-text-{1} w3-xlarge w3-margin-right"></i><span class="w3-text-{6}"><b>{0}</b></span></td>
                        <td class="w3-text-{7}">{2}</td>
                        <td class="w3-text-{6}">{3}</td>
                        <td class="w3-text-{6}">{4}</td>
                    </tr>`;

        let html = ''
        watch_list.forEach((v) => {
            html += template
                .replace('{0}', v)
                .replace('{0}', v)
                .replace('{1}', highlight_orange.indexOf(v) >= 0 ? 5 : '{1}')
                .replace('{2}', highlight_orange.indexOf(v) >= 0 ? 'orange' : '{2}')
                .replace('{1}', highlight_blue.indexOf(v) >= 0 ? 5 : '{1}')
                .replace('{2}', highlight_blue.indexOf(v) >= 0 ? 'blue' : '{2}')
                .replace('{1}', highlight_purple.indexOf(v) >= 0 ? 5 : '{1}')
                .replace('{2}', highlight_purple.indexOf(v) >= 0 ? 'purple' : '{2}')
                .replace('{1}', highlight_pink.indexOf(v) >= 0 ? 5 : '{1}')
                .replace('{2}', highlight_pink.indexOf(v) >= 0 ? 'deeppink' : '{2}')
                .replace('{1}', highlight_green.indexOf(v) >= 0 ? 5 : '{1}')
                .replace('{2}', highlight_green.indexOf(v) >= 0 ? 'green' : '{2}')
                .replace('{1}', highlight_black.indexOf(v) >= 0 ? 5 : '{1}')
                .replace('{2}', highlight_black.indexOf(v) >= 0 ? 'grey' : '{2}')
                .replace('{1}', 1)
                .replace('{2}', 'lightgrey');
        })
        document.getElementById('watch-symbols').innerHTML = html;
        document.getElementById('bars-analysis-symbols').innerHTML = html;

        let html_pdt_1 = '';
        let html_pdt_2 = '';
        let html_pdt_3 = '';
        watch_list = [...highlight_pink, ...highlight_green, ...highlight_blue, ...highlight_orange, ...highlight_purple, ...highlight_grey];
        watch_list.push(...INDICATORS);
        watch_list = watch_list.filter((v, i, a) => a.indexOf(v) === i).filter((v) => v !== '-');
        const divisor = Math.ceil(watch_list.length / 3);
        watch_list.forEach((v, i) => {
            // const fields = 'name,description,seed,date,day_pct,day,gain,gain_pct,action'.split(',');
            const position = RESULTS.POSITIONS.find((v2) => v2.name === v);
            let color = 'grey';
            color = highlight_orange.indexOf(v) >= 0 ? 'orange' : color;
            color = highlight_green.indexOf(v) >= 0 ? 'green' : color;
            color = highlight_blue.indexOf(v) >= 0 ? 'blue' : color;
            color = highlight_purple.indexOf(v) >= 0 ? 'purple' : color;
            color = highlight_pink.indexOf(v) >= 0 ? 'pink' : color;
            const get_template = () => {
                return template_pdt
                    .replace('{0}', v)
                    .replace('{1}', color)
                    .replace('{2}', position ? position.seed : 0)
                    .replace('{3}', position ? position.day_pct : 0)
                    .replace('{4}', position ? position.day : 0)
                    .replace('{5}', '-o') //color !== 'grey' ? '' : '-o')
                    .replace('{6}', position ? (position.day >= 0 ? 'green' : 'red') : 'grey')
                    .replace('{6}', position ? (position.day >= 0 ? 'green' : 'red') : 'grey')
                    .replace('{6}', position ? (position.day >= 0 ? 'green' : 'red') : 'grey')
                    .replace('{7}', position ? 'black' : 'grey')
            }
            if (i < divisor) {
                html_pdt_1 += get_template();
            } else if (i < divisor * 2) {
                html_pdt_2 += get_template();
            } else {
                html_pdt_3 += get_template();
            }
        })
        document.getElementById('table-rows-pdt-1').innerHTML = html_pdt_1;
        document.getElementById('table-rows-pdt-2').innerHTML = html_pdt_2;
        document.getElementById('table-rows-pdt-3').innerHTML = html_pdt_3;
    }
    add_watch_list();

    const add_indicators = () => {
        let watch_list = INDICATORS;

        const template = `<div class="w3-button w3-margin-right" style="width:150px;border:{1}px solid {2}" onclick=(click_symbol("{0}"))>{0}</div>`;
        let html = ''
        watch_list.forEach((v) => {
            html += template
                .replace('{0}', v)
                .replace('{0}', v)
                .replace('{1}', watch_list.indexOf(v) >= 0 ? 3 : 0)
                .replace('{2}', 'lightgrey');
        })
        document.getElementById('indicator-symbols').innerHTML = html;
    }
    add_indicators();

    const update_ui = () => {
        const g = RESULTS.CALCS.EQUITY - RESULTS.CALCS.INVESTED;
        document.getElementById('day-status-gain').innerText = round(g).toLocaleString();
        document.getElementById('day-status-gain').style.color = g > 0 ? '#4CAF50' : (g === 0 ? 'grey' : '#e50000');
        document.getElementById('day-status-gain-pct').innerText = round1((g) / RESULTS.CALCS.INVESTED * 100).toLocaleString();
        // document.getElementById('day-analysis-gain').innerText = round(g).toLocaleString();
        // document.getElementById('day-analysis-gain').style.color = g > 0 ? '#4CAF50' : (g === 0 ? 'grey' : '#e50000');

        document.getElementById('day-status-today').innerText = round1(RESULTS.CALCS.TODAY).toLocaleString();
        document.getElementById('day-status-today').style.color = RESULTS.CALCS.TODAY > 0 ? '#4CAF50' : (RESULTS.CALCS.TODAY === 0 ? 'grey' : '#e50000');
        document.getElementById('day-status-today-pct').innerText = round2(RESULTS.CALCS.TODAY / RESULTS.CALCS.INVESTED * 100).toLocaleString();
        // document.getElementById('day-analysis-today').innerText = round1(RESULTS.CALCS.TODAY).toLocaleString();
        // document.getElementById('day-analysis-today').style.color = RESULTS.CALCS.TODAY > 0 ? '#4CAF50' : '#e50000';

        update_elem_text('mobile-gain', g);
        document.getElementById('mobile-gain-pct').innerText = round2(g / RESULTS.CALCS.INVESTED * 100).toLocaleString();
        update_elem_text('mobile-today', RESULTS.CALCS.TODAY);
        document.getElementById('mobile-today-pct').innerText = round2(RESULTS.CALCS.TODAY / RESULTS.CALCS.INVESTED * 100).toLocaleString();

        // document.getElementById('mobile-gain').innerText = round(g).toLocaleString();
        // document.getElementById('mobile-gain').style.color = g > 0 ? '#4CAF50' : (g === 0 ? 'grey' : '#e50000');
        // document.getElementById('mobile-today').innerText = round1(RESULTS.CALCS.TODAY).toLocaleString();
        // document.getElementById('mobile-today').style.color = RESULTS.CALCS.TODAY > 0 ? '#4CAF50' : (RESULTS.CALCS.TODAY === 0 ? 'grey' : '#e50000');

        document.getElementById('day-status-target').innerText = RESULTS.CALCS.TARGET.toLocaleString();
        document.getElementById('day-status-target-delta').innerText = round1(RESULTS.CALCS.DELTA).toLocaleString();
        // // document.getElementById('day-analysis-target').innerText = RESULTS.CALCS.DELTA.toLocaleString();

        document.getElementById('day-status-equity').innerText = round(RESULTS.CALCS.EQUITY).toLocaleString();
        document.getElementById('day-status-invested').innerText = round(RESULTS.CALCS.INVESTED).toLocaleString();
        // document.getElementById('day-analysis-equity').innerText = round(RESULTS.CALCS.EQUITY).toLocaleString();

        const map = {
            name: 'Symbol',
            description: 'Description',
            date: 'Date',
            seed: 'Seed',
            gain: 'Total',
            gain_pct: '%',
            day: 'Day',
            day_pct: '%',
            action: '',
        };
        const fields = 'name,description,seed,date,day_pct,day,gain,gain_pct,action'.split(',');
        let html = '';
        fields.forEach((v, i) => {
            // html += `<tr>`
            if (i < fields.length - 1) {
                html += `<td style="border-bottom:1px solid;""><b>${map[v]}</b></td>`
            } else {
                html += `<td style="border-bottom:1px solid;""><i class="fa fa-credit-card w3-xxlarge"></i></td>`
            }
            // html += `</tr>`
        })
        document.getElementById('day-status-table-header').innerHTML = html;

        html = '';
        RESULTS.POSITIONS.forEach((v, i) => {
            html += `<tr ${i === (RESULTS.POSITIONS.length - 1) ? 'style="border-bottom:1px solid;"' : ''}>`
            fields.forEach((f, i) => {
                if (i < fields.length - 1) {
                    html += `<td class="w3-wide">${v[f] || '-'}</td>`
                } else {
                    html += `<td class="w3-wide"><i class="fa fa-credit-card w3-xxlarge w3-text-red w3-margin-right pointer" onclick="sell_symbol()"></i></td>`
                }
            });
            html += `</tr>`
        });
        document.getElementById('day-status-table-rows').innerHTML = html;
        format_table('day-status-table');
    };
    update_ui();

    const update_charts = () => {
        let series = [
            { name: 'Gain', type: 'area', data: [] },
            { name: 'Invested', type: 'line', data: [] }
        ];

        series[0].data = RESULTS.HISTORY_1W_DAY.timestamp.map((v, i) => { return { x: v * 1000, y: RESULTS.HISTORY_1W_DAY.equity[i] } });
        series[0].data.push({ x: Date.now(), y: RESULTS.ACCOUNT.equity });

        const filtered = RESULTS.DEPOSITS.slice(-(series[0].data.length + 3));
        series[1].data = filtered.map((v, i) => { return { x: v.e, y: v.amount } });
        series[1].data.push({ x: Date.now(), y: series[1].data[series[1].data.length - 1].y });

        // series[0].data.forEach((v,i)=>v.y -= series[1].data[i].y);
        // series[1].data.forEach((v,i)=>v.y -= series[1].data[i].y);

        let last = series[0].data[0].y;
        series[0].data.forEach((v, i) => {
            if (i === 1 || i === series[0].data.length - 3 || i === series[0].data.length - 2) {
                // CHART_DAY_HISTORY.options.annotations.points.push(add_annotation_point_2(v.x, v.y, round(v.y - RESULTS.CALCS.INVESTED)))

                // const value = v.y - last
                // CHART_DAY_HISTORY.options.annotations.points.push(add_annotation_point_2(v.x, v.y, round1(value)));
                // last = series[0].data[i].y;

                // const filtered = RESULTS.DEPOSITS.filter((v2)=>v2.e >= v.x);
                // const invested = filtered.length > 0 ? filtered[0].amount : v.y;
                // value = v.y - invested;
                // CHART_DAY_HISTORY.options.annotations.points.push(add_annotation_point_2(v.x, v.y, round1(value)));

                // const filtered = RESULTS.DEPOSITS.filter((v2)=>v2.e >= v.x);
                // const invested = filtered.length > 0 ? filtered[0].amount : RESULTS.DEPOSITS[RESULTS.DEPOSITS.length-1].amount;
                // value = v.y - invested;
                const value = v.y;
                compare_charts_map.CHART_DAY_HISTORY.options.annotations.points.push(add_annotation_point_2(v.x, v.y, round(value).toLocaleString()));
            }
        });
        compare_charts_map.CHART_DAY_HISTORY.options.annotations.yaxis = [add_annotation_y(series[0].data[series[0].data.length - 1].y)];
        compare_charts_map.CHART_DAY_HISTORY.options.chart.height = 250;
        // CHART_DAY_HISTORY.options.dataLabels.enabled = true;
        // CHART_DAY_HISTORY.options.yaxis.max = Math.max(...series[0].data.map((v)=>v.y) + 500);
        compare_charts_map.CHART_DAY_HISTORY.options.series = series;
        compare_charts_map.CHART_DAY_HISTORY.render();

        // CHART_PDT_RECENT.options.dataLabels.enabled = true;
        // CHART_PDT_RECENT.options.yaxis.max = Math.max(...series[0].data.map((v)=>v.y) + 500);
        // CHART_PDT_RECENT.options.series = series;
        // CHART_PDT_RECENT.render();

        //* TODAY CHART */
        series = [{ name: 'Gain', type: 'area', data: [] }];
        series[0].data = RESULTS.HISTORY_1D_MIN.timestamp.map((v, i) => { return { x: v * 1000, y: RESULTS.HISTORY_1D_MIN.equity[i] } });
        series[0].data.push({ x: Date.now(), y: RESULTS.ACCOUNT.equity });
        series[0].data = series[0].data.filter((v) => v.x > new Date(series[0].data[0].x).setHours(4, 0));
        series[0].data = series[0].data.filter((v) => v.x < new Date(series[0].data[0].x).setHours(23, 59));
        const equity_0930 = series[0].data.find((v) => new Date(v.x).getHours() === 9 && new Date(v.x).getMinutes() === 30) || 0
        compare_charts_map.CHART_24H_HISTORY.options.chart.height = IS_LARGE ? 450 : 250;
        compare_charts_map.CHART_24H_HISTORY.options.series = series;
        compare_charts_map.CHART_24H_HISTORY.options.annotations.xaxis = [
            add_annotation_x(new Date(series[0].data[series[0].data.length - 1].x).setHours(4, 0)),
            add_annotation_x(new Date(series[0].data[series[0].data.length - 1].x).setHours(9, 30)),
            add_annotation_x(new Date(series[0].data[series[0].data.length - 1].x).setHours(10, 0), null, colors.darkcyan),
            add_annotation_x(new Date(series[0].data[series[0].data.length - 1].x).setHours(10, 30), null, colors.lightgrey),
            add_annotation_x(new Date(series[0].data[series[0].data.length - 1].x).setHours(16, 0)),
            add_annotation_x(new Date(series[0].data[series[0].data.length - 1].x).setHours(15, 25), null, colors.lightgrey),
            // add_annotation_x(new Date(series[0].data[series[0].data.length - 1].x).setHours(15, 30), null, colors.darkcyan),
            add_annotation_x(new Date(series[0].data[series[0].data.length - 1].x).setHours(20, 0)),
        ];
        compare_charts_map.CHART_24H_HISTORY.options.annotations.yaxis = [add_annotation_y(series[0].data[series[0].data.length - 1].y)];
        compare_charts_map.CHART_24H_HISTORY.render();

        clone = deepClone(compare_charts_map.CHART_24H_HISTORY.options);
        if (getHMM(new Date()) >= 930 && getHMM(new Date()) <= 1630) {
            clone.series[0].data = clone.series[0].data.filter((v) => v.x >= new Date(series[0].data[0].x).setHours(9, 0));
            clone.series[0].data = clone.series[0].data.filter((v) => v.x <= new Date(series[0].data[0].x).setHours(16, 3));
        }
        clone.chart.height = 225;

        // const d1 = new Date(clone.series[0].data[clone.series[0].data.length - 1].x);
        // const sod = clone.series[0].data.find((v) => v.x >= new Date(clone.series[0].data[0].x).setHours(15, 25));
        // const eod = clone.series[0].data.find((v) => v.x >= new Date(clone.series[0].data[0].x).setHours(15, 55));
        // clone.annotations.xaxis[2] = add_annotation_x(d1.setHours(15, 30), `$ ${round((eod.y || 0) - (sod.y || 0)).toString()}`, colors.darkcyan);

        CHART_PDT_ACCOUNT.options = clone;
        CHART_PDT_ACCOUNT.render();

        clone = deepClone(compare_charts_map.CHART_24H_HISTORY.options);
        // if (getHMM(new Date()) >= 930 && getHMM(new Date()) <= 1630) {
        //     clone.series[0].data = clone.series[0].data.filter((v) => v.x >= new Date(series[0].data[0].x).setHours(9, 0));
        //     clone.series[0].data = clone.series[0].data.filter((v) => v.x <= new Date(series[0].data[0].x).setHours(16, 3));
        // }
        clone.chart.height = 250;
        CHART_BARS_ANALYSIS_ACCOUNT.options = clone;
        CHART_BARS_ANALYSIS_ACCOUNT.render();

        series = [{ name: 'Gain %', type: 'treemap', data: [] }];
        series[0].data = RESULTS.POSITIONS.map((v, i) => { return { x: v.name, y: v.gain_pct } });
        CHART_POSITIONS.options.chart.type = 'treemap';
        CHART_POSITIONS.options.chart.height = 175;
        // CHART_POSITIONS.options.dataLabels.enabled = true;
        CHART_POSITIONS.options.xaxis.type = 'category';
        CHART_POSITIONS.options.dataLabels.formatter = function (text, op) {
            return [text, op.value]
        };
        // CHART_POSITIONS.options.tooltip.x.format = null;
        // CHART_POSITIONS.options.tooltip.y.format = null;
        CHART_POSITIONS.options.series = series;
        CHART_POSITIONS.render();

        series = [{ name: 'Gain %', type: 'treemap', data: [] }];
        series[0].data = RESULTS.POSITIONS.map((v, i) => { return { x: v.name, y: v.day_pct } });
        CHART_POSITIONS_TODAY.options.chart.type = 'treemap';
        CHART_POSITIONS_TODAY.options.chart.height = IS_LARGE ? 750 : 500;
        // CHART_POSITIONS_TODAY.options.dataLabels.enabled = true;
        CHART_POSITIONS_TODAY.options.xaxis.type = 'category';
        CHART_POSITIONS_TODAY.options.dataLabels.formatter = function (text, op) {
            return [text, op.value]
        };
        CHART_POSITIONS_TODAY.options.series = series;
        CHART_POSITIONS_TODAY.render();

        clone = deepClone(CHART_POSITIONS_TODAY.options);
        clone.chart.height = 130;
        CHART_PDT_TODAY_TREE.options = clone;
        CHART_PDT_TODAY_TREE.render();

        clone = deepClone(CHART_POSITIONS_TODAY.options);
        clone.chart.height = 250;
        CHART_BARS_ANALYSIS_POSITIONS.options = clone;
        CHART_BARS_ANALYSIS_POSITIONS.render();


        // let chart = new ApexCharts(document.querySelector('chart-days-history'), treemap_options);
        // chart.render();
        // let chart = new ApexCharts(document.querySelector('chart-days-history'), CHART_DAY_HISTORY.options);
        // chart.render();
    };
    update_charts();

    const update_trend = () => {
        // const analysis = analyze_orders().filter((v, i) => i >= 14);
        const analysis = analyze_orders();//.filter((v, i) => v.d >= '2026-04-30');

        let series = [
            { name: 'Gain', type: 'area', data: [] },
            { name: 'P / L', type: 'bar', data: [] },
            { name: 'Equity', type: 'line', data: [] },
            { name: 'Goal', type: 'line', data: [] },
        ];

        let g = SEED_AMOUNT * 0.0075;
        series[0].data = RESULTS.TREND.map((v, i) => { return { x: v.dmmm, y: v.total } });
        series[1].data = RESULTS.TREND.map((v, i) => { return { x: v.dmmm, y: round(v.delta) } });
        series[2].data = RESULTS.TREND.map((v, i) => { return { x: v.dmmm, y: round(v.equity - SEED_AMOUNT) } });
        series[3].data = RESULTS.TREND.map((v, i) => { return { x: v.dmmm, y: round(i * g) } });


        // series[0].data = analysis.map((v, i) => { return { x: v.dmmm, y: v.net } });
        // series[1].data = analysis.map((v, i) => { return { x: v.dmmm, y: v.day_gain } });
        // // series[2].data = analysis.map((v, i) => { return { x: v.dmmm, y: v.target } });

        // // series[0].data.forEach((v) => {
        // //     v.goals = [
        // //         {
        // //             name: 'Expected',
        // //             value: 326.25,
        // //             strokeHeight: 7.5,
        // //             strokeColor: colors.orange, //'#775DD0'
        // //         }
        // //     ]
        // // });

        // // series[1].data.forEach((v) => {
        // //     CHART_TREND.options.annotations.points.push(add_annotation_point(v.x, v.y, `$ ${round(v.y).toLocaleString()}`));
        // // });
        // // console.log(CHART_TREND.options.annotations.points);

        CHART_TREND.options.dataLabels.enabledOnSeries = [0, 1, 2];
        CHART_TREND.options.stroke.width = [0.5, 1.5, 5, 5],
            CHART_TREND.options.stroke.curve = ['straight', 'straight', 'straight', 'straight']; //, 'monotoneCubic'
        CHART_TREND.options.annotations.yaxis = [add_annotation_y(g, colors.orange)];
        CHART_TREND.options.annotations.xaxis = [add_annotation_x('22-May', colors.grey)];
        CHART_TREND.options.annotations.yaxis[0].y2 = g * 1.04;

        // CHART_TREND.options.dataLabels.enabled = true;
        // CHART_TREND.options.chart.sparkline = false;
        CHART_TREND.options.chart.type = 'area';
        CHART_TREND.options.series = series;
        CHART_TREND.options.plotOptions.bar.colors = {};
        CHART_TREND.options.xaxis.type = 'category';
        CHART_TREND.options.chart.height = IS_MEDIUM ? 550 : 750;
        CHART_TREND.render();

        let t = series[0].data[series[0].data.length - 1].y || 0;
        document.getElementById('trend-chart-title').innerHTML = `$ ${t.toLocaleString()}&nbsp;&nbsp;|&nbsp;&nbsp;${round1(t / SEED_AMOUNT * 100)} %`;
        // document.getElementById('trend-chart-title').innerHTML += ` | <span class="w3-xlarge w3-text-grey">$ ${round2(t / series[0].data.length).toLocaleString()}</span>`;
    };
    update_trend();

    const get_top_list = () => {

    }
    get_top_list();

    const update_mobile = async () => {
        const map = {
            'QQQ': CHART_MOBILE_ACCOUNT,
            'NQ=F': CHART_MOBILE_FUTURES,
            'CL=F': CHART_MOBILE_OIL,
            '^VIX': CHART_MOBILE_VIX,
        }
        for await (const s of Object.keys(map)) {
            const data = await get_symbol_data_24h(s);
            update_symbol_chart_24h(map[s], data, 200);
        }
    }
    update_mobile();

    //@ CHECK POSITIONS */
    check_positions();

    // const update_top_movers = () => {
    //     let series = [
    //         { name: 'Symbol', _type: 'treemap', data: [] },
    //     ];
    //     series[0].data = RESULTS.TOP_MOVERS.sort((a, b) => b.gain - a.gain).map((v, i) => { return { x: v.name, y: v.gain } }).slice(0, 20);
    //     CHART_TOP_SYMBOLS.options.series = series;
    //     CHART_TOP_SYMBOLS.options.chart.type = 'treemap';
    //     CHART_TOP_SYMBOLS.options.xaxis.type = 'category';
    //     CHART_TOP_SYMBOLS.options.dataLabels.enabled = true;
    //     CHART_TOP_SYMBOLS.options.chart.height = 350;
    //     CHART_TOP_SYMBOLS.render();

    //     series = [
    //         { name: 'Symbol', _type: 'treemap', data: [] },
    //     ];
    //     series[0].data = RESULTS.TOP_MOVERS.sort((a, b) => b.last - a.last).slice(0, 20).map((v, i) => { return { x: v.name, y: v.last } }).slice(0, 20);
    //     CHART_TOP_SYMBOLS_LAST.options.series = series;
    //     CHART_TOP_SYMBOLS_LAST.options.chart.type = 'treemap';
    //     CHART_TOP_SYMBOLS_LAST.options.xaxis.type = 'category';
    //     CHART_TOP_SYMBOLS_LAST.options.dataLabels.enabled = true;
    //     // CHART_TOP_SYMBOLS_LAST.options.chart.sparkline.enabled = false;
    //     CHART_TOP_SYMBOLS_LAST.options.chart.height = 350;
    //     CHART_TOP_SYMBOLS_LAST.render();


    //     let html = '';
    //     const template = `<tr>
    //         <td>{0}</td>
    //         <td>{1}</td>
    //         <td>{2}</td>
    //         <td>{3}</td>
    //     </tr>`;
    //     // RESULTS.TOP_MOVERS.slice(0,10).forEach((v) => {
    //     RESULTS.TOP_MOVERS.sort((a, b) => b.gain - a.gain).slice(0, 20).forEach((v) => {
    //         html += template
    //             .replace('{0}', v.name)
    //             .replace('{1}', v.gain)
    //             .replace('{2}', round2(v.last))
    //             .replace('{3}', round2(v.shares));
    //     });
    //     document.getElementById('table-rows-top-1').innerHTML = html;

    //     html = '';
    //     // RESULTS.TOP_MOVERS.slice(10).forEach((v) => {
    //     RESULTS.TOP_MOVERS.sort((a, b) => b.last - a.last).slice(0, 20).forEach((v) => {
    //         html += template
    //             .replace('{0}', v.name)
    //             .replace('{1}', v.gain)
    //             .replace('{2}', round2(v.last))
    //             .replace('{3}', round2(v.shares));
    //     });
    //     document.getElementById('table-rows-top-2').innerHTML = html;
    // };
    // update_top_movers();

    // const update_analysis = () => {
    //     //* CARDS */
    //     const template = `<div class="w3-border w3-wide" style="padding:12px;margin:5px;min-width:175px;cursor:pointer;" onclick="click_symbol('{1}')">
    //                 <div><i class="fa fa-circle-o {0}"></i>&nbsp;{1}</div>
    //                 <div class="w3-xlarge {0}">{2}</div>
    //             </div>`
    //     let html = ''
    //     RESULTS.POSITIONS.map((v) => v.name).forEach((v, i) => {
    //         html += template
    //             .replace('{0}', RESULTS.POSITIONS[i].gain >= 0 ? 'w3-text-green' : 'w3-text-red')
    //             .replace('{0}', RESULTS.POSITIONS[i].gain >= 0 ? 'w3-text-green' : 'w3-text-red')
    //             .replace('{1}', v)
    //             .replace('{1}', v)
    //             .replace('{2}', round1(RESULTS.POSITIONS[i].gain_pct) + '%');
    //     });
    //     document.getElementById('analysis-symbol-cards').innerHTML = html;

    //     //* CHARTS */
    // };
    // update_analysis();
    click_symbol(SELECTED_SYMBOL);
    load_compare();
}
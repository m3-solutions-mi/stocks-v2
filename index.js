function update_table_2(id, table) {

    //* COLUMNS */
    const template_table_header_schedule = `<th class="" style="border-bottom:2px solid grey;">{1}</th>`;
    let html = '';
    // table[0].push('');
    table[0].forEach((v, i) => {
        html += template_table_header_schedule
            // .replace('{0}', borders.indexOf(i) >= 0 ? 'border-right:1px solid #bdbdbd;' : '')
            .replace('{1}', v)
        // .replace('{2}', hide.indexOf(i) >= 0 ? 'w3-hide' : '');
    });
    document.getElementById(`table-header-${id}`).innerHTML = html;

    //* ROWS */
    html = '';
    let data = table; //.filter((v, i) => v[2] === location);
    // indicator | ▼

    data.forEach((r, x) => {
        if (x > 0 && x <= data.length - 1) {
            html += `<tr class="" style="">`;
            for (let y = 0; y < r.length; y++) {
                let column_value = r[y];
                html += `<td class="" style="${y === 0 ? 'font-weight:900;' : ''}${x === data.length - 1 ? 'border-bottom:1px solid' : ''}" contenteditable="false">${column_value}</td>`;
            }
            html += `</tr>`;
        }
    });

    update_table_counts();
    document.getElementById(`table-rows-${id}`).innerHTML = html;
}
// class Data {
//     CONFIG = {};
//     constructor() {
//         // this.refresh();
//     }
//     refresh() {
//         // fetch(`http://localhost:3000/wrm/v1/config`, {})
//         //     // fetch(`../..//wrm/v1/config`, {})
//         //     .then((resp) => resp.json())
//         //     .then((data) => {
//         //         console.log(data);
//         //         this.get_data();
//         //         return data;
//         //     })
//     }
//     get_data(date_str = '2026-04-17') {
//         const promises = [
//             fetch(`http://localhost:3000/wrm/v1/config`, {}).then((resp) => resp.json()),
//             fetch(`http://localhost:3000/wrm/v1/csv/demo/${date_str}`, {}).then((resp) => resp.json()),
//             // fetch(`http://localhost:3000/smi_status/days_summary/${date_str}`, {}).then((resp) => resp.json()),
//             // fetch(`http://localhost:3000/smi_status/days_summary/${date_str}`, {}).then((resp) => resp.json()),
//             // fetch(`http://localhost:3000/smi_status/days_summary/${date_str}`, {}).then((resp) => resp.json()),
//             fetch(`http://localhost:3000/wrm/v1/csv/ama/template`, {}).then((resp) => resp.json()),
//             // fetch(`http://localhost:3000/smi_status/week_summary/${date_str}`, {}).then((resp) => resp.json()),
//             // fetch(`http://localhost:3000/smi_status/month_summary/${date_str}`, {}).then((resp) => resp.json()),
//             // fetch(`http://localhost:3000/smi_status/year_summary/${date_str}`, {}).then((resp) => resp.json()),
//         ]
//         Promise.allSettled(promises).then((v) => {
//             v = v.map((v2) => v2.status === 'fulfilled' ? v2.value : null);
//             this.CONFIG = {
//                 config: v[0],
//                 yesterday: v[1],
//                 today: v[2],
//                 tomorrow: v[3],
//                 days: v[4],
//                 week: v[5],
//                 month: v[6],
//                 year: v[7],
//             };
//             console.log(this.CONFIG);
//             // this.update_table('', v[1]);
//         });
//     }
//     update_table(id, table, is_schedule = true) {

//         //* COLUMNS */
//         const template_table_header_schedule = `<th class="{2}" style="border-bottom:2px solid grey;{0}">{1}</th>`;
//         let html = '';
//         // table[0].push('');
//         table[0].forEach((v, i) => {
//             html += template_table_header_schedule
//                 .replace('{0}', borders.indexOf(i) >= 0 ? 'border-right:1px solid #bdbdbd;' : '')
//                 .replace('{1}', v)
//                 .replace('{2}', hide.indexOf(i) >= 0 ? 'w3-hide' : '');
//         });
//         document.getElementById(`table-header-${elem_id}`).innerHTML = html;

//         //* ROWS */
//         html = '';
//         let data = table; //.filter((v, i) => v[2] === location);
//         // indicator | ▼

//         const col_indexes = {
//             operators: table[0].findIndex((v) => v === 'Operator'),
//             priorities: table[0].findIndex((v) => v === 'Priority'),
//             locations: table[0].findIndex((v) => v === 'Location'),
//             units: table[0].findIndex((v) => v === 'Unit'),
//             stati: table[0].findIndex((v) => v === 'Status'),
//         };
//         const units = ['', 'h', 'c'];
//         const priorities = ['', '1', '2', '3'];
//         const stati = ['', 'RUN', 'REPAIR', 'CHECKS', 'WAIT', 'NO MATERIAL'];
//         const operators = ['', 'Bill', 'Dave', 'Jerry', 'Joe', 'Tom', 'Sue'];
//         const locations = [
//             '', 'TB23', 'TB24', 'TB25',
//             'Packout Table 1', 'Packout Table 2', 'Tweak Part #3', 'Hose-Sleeve Cut', 'Pines Pack', 'Eaton Lenpack', 'Kohler',
//             'Miic 30 Pack', 'Crippa Pack', 'Crimp', 'Leak Test #1', 'Leak Test #2', 'Leak Test #3'
//         ];
//         const template_dropdown = (value, values) => `
//         <div class="w3-dropdown-hover w3-white" style="width:100%;">
//             <div id="" class="w3-white" style="width:100%;"><span class="">${value}</span>
//                 <span class="w3-right w3-white w3-text-grey">&nbsp;&nbsp;</span></div>
//             <div class="_w3-text-green w3-dropdown-content w3-bar-block w3-card"
//                 style="width:100%;min-width:225px;max-height:400px;overflow-y:auto;">
//                 ${values.map((v) => {
//             return `<a onclick="this.parentElement.parentElement.children[0].children[0].innerHTML='${v}'" class="_w3-hide w3-padding w3-bar-item w3-button">${v === '' ? '&nbsp;' : v}</a>`
//         }).join('\n')}
//             </div>
//         </div>`;
//         data.forEach((r, x) => {
//             if (x > 0 && x <= data.length - 1) {
//                 const new_location = x > 1 && r[col_indexes.locations] !== data[x - 1][col_indexes.locations] ? 'border-top:1px solid;' : '';
//                 html += `<tr class="${x === data.length - 1 ? 'w3-light-grey' : ''}" style="${new_location}${x === data.length - 1 ? 'font-weight:900;' : ''}">`;
//                 // r.push(x !== data.length - 1 ? '<i class="fa fa-plus-square-o" style="cursor:pointer;"></i>' : '&nbsp;');
//                 // html += `<tr class="${x === data.length - 1 ? 'w3-light-grey' : ''}" style="">`;
//                 for (let y = 0; y < r.length; y++) {

//                     if (x > 1 && y >= 2 && data[x - 1][y] === r[y]) {
//                         r[y] = '';
//                     }

//                     let column_value = r[y];
//                     if (x !== data.length - 1) {
//                         column_value = y === col_indexes.locations ? template_dropdown(r[y], locations) : column_value;
//                         column_value = y === col_indexes.operators ? template_dropdown(r[y], operators) : column_value;
//                         column_value = y === col_indexes.priorities ? template_dropdown(r[y], priorities) : column_value;
//                         column_value = y === col_indexes.units ? template_dropdown(r[y], units) : column_value;
//                         column_value = y === col_indexes.stati ? column_value = template_dropdown(r[y], stati) : column_value;
//                     }
//                     const editable = y !== data.length - 1 && y !== 2 && y !== 9 && y !== 10 && y !== 11 && y !== 14 && y !== 15 ? 'true' : 'false';
//                     html += `<td class="${hide.indexOf(y) >= 0 ? 'w3-hide' : ''}" style="${borders.indexOf(y) >= 0 ? 'border-right:1px solid #bdbdbd;' : ''}" contenteditable="${editable}" onfocus="window.getSelection().selectAllChildren(this)" onblur="update_table_counts()">${column_value}</td>`;
//                 }
//                 html += `</tr>`;
//             }
//         });

//         let qty = table[table.length - 1][col_qty];
//         let done = table[table.length - 1][col_done];
//         let nc = table[table.length - 1][col_nc];
//         let delta = table[table.length - 1][col_delta];

//         // let qty = meta.totals.qty;
//         // let done = meta.totals.done;
//         // let nc = meta.totals.nc;
//         // let delta = meta.totals.delta;
//         // r = ['', '', 'TOTAL', '', '', '', '', '', qty, '', '', '', done, nc, delta, ''];

//         const complete_pct = round1(done / qty * 100);
//         const nc_pct = round1(nc / done * 100);
//         // const delta_pct = round1(100 - (complete_pct - nc_pct));
//         const delta_pct = round1((done - qty) / qty * 100);
//         const score_pct = round1(complete_pct * ((100 - delta_pct - nc_pct) / 100));

//         document.getElementById('complete').innerHTML = isNaN(complete_pct) ? '-' : complete_pct;
//         document.getElementById('nc').innerHTML = isNaN(nc_pct) ? '0' : nc_pct;
//         document.getElementById('delta').innerHTML = isNaN(delta_pct) ? '0' : delta_pct;
//         document.getElementById('score').innerHTML = isNaN(score_pct) ? '0' : score_pct;

//         // html += `<tr class="w3-light-grey" style="border-top:2px solid black !important;border-bottom:2px solid black;">`;
//         // for (let x = 0; x < r.length; x++) {
//         //     html += `<td class="${x < 2 ? 'w3-hide' : ''}" style="${x === 7 || x === 11 ? 'border-right:1px solid #bdbdbd;' : ''}" contenteditable="false"><b>${r[x]}</b></td>`;
//         // }
//         // html += `</tr>`;
//         update_table_counts();
//         document.getElementById(`table-rows-${elem_id}`).innerHTML = html;
//     }
// }
function analyze_orders() {
    const obj = [];
    // obj.push(...RESULTS.ORDERS);
    const orders = RESULTS.ORDERS;//.reverse();
    const symbols = orders.map((v) => v.symbol).filter((v, i, a) => a.indexOf(v) === i).sort();
    symbols.forEach((s) => {
        const filtered = orders
            .filter((v) => v.symbol === s)
            .map((v) => {
                return {
                    d: getYMD(new Date(v.filled_at)),
                    t: getHMM_string(new Date(v.filled_at)),
                    side: v.side,
                    g: round2(v.filled_avg_price * v.filled_qty),
                    notional: v.notional,
                    p: v.filled_avg_price,
                    q: v.filled_qty,
                }
            });
        obj.push({ symbol: s, orders: filtered });
        // obj[s] = filtered;
    })
    // console.log(obj);


    const obj2 = [];
    const days = obj.map((v) => [...v.orders.map((v2) => v2.d)])
        .reduce((p, c) => [...p, ...c])
        .filter((v, i, a) => a.indexOf(v) === i)
        .sort();
    // console.log(days);

    const summary = [];
    days.forEach((d) => {
        let total = 0;
        let buys_total = 0;
        obj.forEach((s) => {
            const bought = s.orders.filter((v) => v.d === d && v.side === 'buy').map((v) => v.g);
            buys = bought.length > 0 ? bought.reduce((p, c) => p + c) : 0;
            s.orders.filter((v) => v.d === d && v.side === 'sell').forEach((o) => {
                // total += o.g - buys - (invested.length > 0 ? invested[0].amount : 0);
                total += o.g - buys;
                buys_total += buys;
                // total += o.g;
            })
        })
        const index = RESULTS.HISTORY_1W_DAY.timestamp.findIndex((v) => v === new Date(d + 'T20:00:00').getTime() / 1000);
        const invested = RESULTS.DEPOSITS.filter((v) => v.date >= d);
        summary.push({
            d: d,
            g: round2(total),
            spend: round2(buys_total),
            i: invested[0].amount,
            equity: RESULTS.HISTORY_1W_DAY.equity[index],
            diff: round2(RESULTS.HISTORY_1W_DAY.equity[index] - invested[0].amount),
            target: round2(invested[0].amount * 0.0075),
        });
        // console.log(index, RESULTS.HISTORY_1W_DAY.equity);
    })
    // console.log(summary);


    //* DAY SUMMARY */
    let total = 0;
    const day_summary = summary.map((v, i) => {
        const g = round2(i === 0 ? (v.equity - v.i) : (v.equity - summary[i - 1].equity));
        total += g;
        return {
            day: v.d,
            dmmm: getDMMM(new Date(v.d + 'T12:00:00')),
            equity: v.equity,
            day_gain: g,
            net: round2(total),
            target: v.target,
            target_delta: round2(g - v.target),
        }
    });
    // console.table(day_summary);

    return day_summary;
}
async function get_all_symbols(symbols = null, timeframe = '1D', start = getYMD(Date.now() - (7 * 24 * 60 * 60 * 1000))) {
    return new Promise(async (resolve) => {
        const promises = [];

        // VCX
        const highlight_grey = 'BTSG,CAT,COHR,GOOGL,IREN,PLUG'.split(',').sort();
        const highlight_orange = 'AAOI,ALAB,AMZN,AVT,CIFR,CRDO,DELL,GEV,HOOD,LITE,RKLB,ROKU,TSM'.split(',').sort();
        const highlight_blue = 'AMD,AXTI,CRWV,DIOD,DRAM,INTC,KOPN,MCHP,MPWR,MTSI,MU,NBIS,ON,PENG,POWL,SITM,SMCI,SNDK,SOXL,SOXX,STRL,STX,TER,TSEM,VIAV,VRT,VSAT,WDC,WULF'.split(',').sort();
        const highlight_green = '-'.split(',').sort();
        const highlight_purple = 'UMC'.split(',').sort();
        const highlight_deeppink = 'QQQ'.split(',').sort();

        let watch_list = [...highlight_grey, ...highlight_green, ...highlight_blue, ...highlight_orange, ...highlight_purple, ...highlight_deeppink];
        watch_list = watch_list.filter((v, i, a) => a.indexOf(v) === i).filter((v) => v !== '-').sort();

        // // symbols = symbols ? symbols : 'AMD,AXTI,CRWV,DIOD,DRAM,INTC,KOPN,MCHP,MPWR,MTSI,MU,NBIS,ON,PENG,POWL,SITM,SMCI,SNDK,SOXL,SOXX,STRL,STX,TER,TSEM,VIAV,VRT,VSAT,WDC,WULF';
        // symbols = symbols ? symbols : 'AMD,AVT,AXTI,CAT,CIFR,COHR,CRWV,DIOD,DRAM,GEV,INTC,IREN,LITE,MCHP,MPWR,MTSI,MU,NBIS,ON,PENG,SITM,SMCI,SNDK,SOXX,STX,TER,TSEM,TSM,VIAV,VRT,WDC,WULF';
        // // symbols.split(',').sort().forEach((s) => {
        const dow = new Date().getDay();
        const start_at = getYMD(new Date(Date.now() - ((dow === 0 ? 28.5 : (dow === 6 ? 1.35 : 0.5)) * 24 * 60 * 60 * 1000)));
        // const start_at = start;
        const end_at = '2030-01-01';
        // const url = `https://m3-solutions-mi.com/${s}/1Day/${start_at}/${end_at}`;
        // https://m3-solutions-mi.com/NDAQ/1D/2026-01-01T23:59:59/2027-01-01
        // const url = `https://m3-solutions-mi.com/${symbols}/1D/${start}T23:59:59/2027-01-01`;
        // url = DATA_SOURCE === 'm3' ?
        //     `https://m3-solutions-mi.com/${s}/${timeframe}/${start_at}/${end_at}` :
        //     `https://data.alpaca.markets/v2/stocks/bars?symbols=${s}&timeframe=${$timeframe}&start=${start_at}&end=${end_at}&feed=iex&limit=5000&sort=asc`;

        watch_list.forEach((s) => {
            const url = DATA_SOURCE === 'm3' ?
                `https://m3-solutions-mi.com/${s}/1D/2026-01-01T23:59:59/2027-01-01` :
                `https://data.alpaca.markets/v2/stocks/bars?symbols=${s}&timeframe=1D&start=2026-03-01&end=2027-01-01&feed=iex&limit=5000&sort=asc`;
            // const url = `https://m3-solutions-mi.com/${s}/1D/${start}T23:59:59/2030-01-01`;
            promises.push(fetch(url, {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    'APCA-API-KEY-ID': ALPACA_KEY,
                    'APCA-API-SECRET-KEY': ALPACA_SECRET,
                }
            }).then((resp) => resp.json())
            );
        });
        // });
        const data = await Promise.allSettled(promises);


        const result = data.map((v) => {
            const values = Object.values(v.value.bars)[0];
            const shares = 1000 / values[0].o;
            const last = values[values.length - 1];
            return {
                name: Object.keys(v.value.bars)[0],
                gain: round2((values[values.length - 1].c - values[0].o) * shares),
                last: round2((last.c - last.o) * (1000 / last.o)),
                shares: round1(shares),
                values
            }
        });
        // console.log(result.sort((a, b) => b.gain - a.gain));
        // console.log(round2(result.map((v) => v.gain).reduce((p, c) => p + c)));
        // console.log(round2(result.map((v) => v.last).reduce((p, c) => p + c)));

        let filtered = result.filter((v) => v.gain >= 100).sort((a, b) => b.gain - a.gain).slice(0, 30);
        // console.table(filtered);
        // console.log(round2(filtered.map((v) => v.gain).reduce((p, c) => p + c)));
        // console.log(round2(filtered.map((v) => v.last).reduce((p, c) => p + c)));
        // console.log(filtered.map((v) => v.name).join(','));
        // console.log(filtered.map((v) => v.name).sort().join(','));

        // filtered = result.filter((v) => v.gain >= 100).sort((a, b) => b.last - a.last).slice(0, 30);
        // console.table(filtered);
        // console.log(round2(filtered.map((v) => v.gain).reduce((p, c) => p + c)));
        // console.log(round2(filtered.map((v) => v.last).reduce((p, c) => p + c)));
        // console.log(filtered.map((v) => v.name).join(','));
        // console.log(filtered.map((v) => v.name).sort().join(','));
        // resolve(filtered);

        resolve(result);
    });
}
async function combine_symbols(symbols = 'PENG') {
    // symbols = null;
    const raw = await get_all_symbols(symbols);
    let start_at = new Date(getYMD(new Date(raw[0].values[0].t)) + 'T09:30:00').getTime();
    const end_at = new Date(getYMD(new Date(raw[0].values[raw[0].values.length - 1].t)) + 'T16:00:00').getTime();
    let combined = [];
    while (start_at <= end_at) {
        combined.push({
            dt: '-',
            dth: '-',
            c: 0,
            o: 0,
            d: 0,
            t: start_at,
            tl: new Date(start_at).toLocaleString(),
            e: start_at,
        });
        start_at += (5 * 60 * 1000);
    }
    // const combined = raw[0].values.map((v) => {
    //     return {
    //         dt: '-',
    //         dth: '-',
    //         c: 0,
    //         o: 0,
    //         d: 0,
    //         t: v.t,
    //         tl: new Date(v.t).toLocaleString(),
    //         e: new Date(v.t).getTime(),
    //     }
    // });

    raw.forEach((s, i) => {
        const num = 1000 / s.values[0].c;
        combined.forEach((x, ii) => {
            const found = s.values.find((v) => new Date(v.t).getTime() >= x.e);
            x.c += round2(found ? (found.c * num) : 0);
            x.o += round2(found ? (found.o * num) : 0);
        });
    })
    combined.forEach((v) => { return { tl: v.tl, c: round2(v.c), o: round2(v.o) } });
    combined.forEach((v) => {
        v.c = round2(v.c);
        v.o = round2(v.o);
        v.d = round2(v.c - v.o);
        v.dt = v.tl.split(', ')[0];
        v.dth = v.tl.split(', ')[1];
    });

    //* SOD */
    // let filtered = combined.filter((v) => v.dth === '9:35:00 AM' || v.dth === '10:00:00 AM');
    // filtered.forEach((v, i) => {
    //     if (v.dth === '10:00:00 AM') {
    //         v.d = round2(v.c - filtered[i - 1].c)
    //         v.o = round2(filtered[i - 1].c)
    //     }
    // })
    // filtered = filtered.filter((v) => v.dth === '10:00:00 AM');
    // console.log('%c10:00 AM | ' + round2(filtered.map((v) => v.d).reduce((p, c) => p + c)), 'color:yellow;');
    // console.table(filtered);

    //* EOD */
    let filtered = combined.filter((v) => v.dth === '3:25:00 PM' || v.dth === '3:55:00 PM');
    filtered.forEach((v, i) => {
        if (v.dth === '3:55:00 PM') {
            v.d = round2(v.c - filtered[i - 1].c)
            v.o = round2(filtered[i - 1].c)
        }
    })
    filtered = filtered.filter((v) => v.dth === '3:55:00 PM');
    console.log('%c3:55 PM | ' + round2(filtered.map((v) => v.d).reduce((p, c) => p + c)), 'color:yellow;');
    console.table(filtered);

    //* DOD */
    const T = '8:00:00 PM';
    filtered = combined.filter((v) => v.dth === T);
    filtered.forEach((v, i) => {
        if (v.dth === T) {
            v.d = round2(v.c - (i > 0 ? filtered[i - 1].c : v.o));
            v.o = round2(i > 0 ? filtered[i - 1].c : v.c - v.o);
        }
    })
    // filtered = filtered.filter((v) => v.dth === '3:55:00 PM');
    const g = round2(filtered.map((v) => v.d).reduce((p, c) => p + c));
    console.log('%c' + T + ' | ' + g, 'color:yellow;');
    console.table(filtered);
}
async function get_trend() {
    return new Promise((resolve, reject) => {
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                'APCA-API-KEY-ID': ALPACA_KEY,
                'APCA-API-SECRET-KEY': ALPACA_SECRET
            }
        };

        // fetch('https://api.alpaca.markets/v2/account/portfolio/history?period=12D&timeframe=1D&intraday_reporting=market_hours&pnl_reset=per_day', options)
        fetch('https://api.alpaca.markets/v2/account/portfolio/history?start=2026-04-30T12:00:00Z&timeframe=1D&intraday_reporting=market_hours&pnl_reset=per_day', options)
            .then(res => res.json())
            .then(res => {
                // console.table(res)
                const obj = [];
                res.timestamp.forEach((stamp, i) => {
                    obj.push({
                        dt: getYMD(new Date(stamp * 1000)),
                        dmmm: getDMMM(new Date(stamp * 1000)),
                        equity: res.equity[i],
                        delta: round2(i > 0 ? res.equity[i] - res.equity[i - 1] : 0),
                        e: stamp * 1000,
                    })
                })
                obj.push({
                    dt: getYMD(new Date()),
                    dmmm: getDMMM(new Date()),
                    equity: +(RESULTS.ACCOUNT.equity),
                    delta: round2(+(RESULTS.ACCOUNT.equity - obj[obj.length - 1].equity)),
                    e: Date.now()
                })
                let t = 0;
                obj.forEach((v, i) => {
                    // v.delta = i === 0 ? 0 : v.equity - obj[obj.length-1].equity;
                    t += v.delta;
                    v.total = round(t);
                })
                // console.table(obj);
                resolve(obj);
            })
            .catch(err => console.error(err));
    });
}
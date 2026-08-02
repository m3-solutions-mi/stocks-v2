class Algorithms {

    constructor() { }


    // iterate_days(callback, start = new Date('2026-07-01').getTime(), end = Date.now()) {
    async iterate_days(callback, num_days = 7) {
        // return new Promise((resolve) => {
        let e = new Date(HELPERS.getYMD(new Date()) + 'T00:00:00').getTime() - (num_days * 24 * 60 * 60 * 1000);
        const now = Date.now();
        console.log(e, now);

        while (e <= now) {
            // console.log('issuing callback');
            await callback(HELPERS.getYMD(new Date(e)));
            e += 24 * 60 * 60 * 1000;
        }
        callback(null);
        // });
    }
    async test_auto_2(symbols_list = 'SOXL', date = '2027-08-03', detail = false) {
        console.log('%c------------------------------------------------------------', 'color:yellow;');

        let g = 0;

        // const symbols = 'MU,SNDK,NBIS,WDC,DRAM,SOXL'.split(',');
        const symbols = symbols_list.split(',');

        const days = [];
        let e = new Date(date).getTime();
        // days.push(date);
        while (e <= Date.now()) {
            const d = new Date(e);
            const dow = d.getDay();
            // if (dow !== 0 && dow !== 6) {
            days.push(HELPERS.getYMD(d));
            // }
            e += (24 * 60 * 60 * 1000);
        }
        // console.log(days);

        const day_gains = [];
        for await (const d of days) {
            console.log(d);
            await HELPERS.sleep(500);
            let g_day = 0;
            for await (const s of symbols) {
                let data = await FETCH_DATA.get_data_5min_day(s, d);
                if (data && data.length > 0) {
                    data = HELPERS.clean_data(data);
                    data = HELPERS.extend_data(data);
                    data = HELPERS.normalize_data(data, 10 * 1000);


                    //#region DATASETS
                    //  applyBands(series[0].data.map((v) => { return { x: v.x, c: v.y } }), 6, 0.75)
                    let bollinger_data = applyBands(data.map((v) => { return { x: v.e, c: v.c } }), 6, 0.75)
                        .map((v, i) => { return { x: v.x, y: (v.bands_c.lowerBand !== 0 ? v.bands_c.lowerBand : data[i].c) } });
                    let delta_data = data.map((v, i) => { return { x: v.e, y: v.c - bollinger_data[i].y } });
                    let ohlc_data = calculateHeikinAshi(data/*.filter((v) => v.e >= last_eod.e)*/);
                    //#endregion

                    if (detail) {
                        console.log(delta_data);
                    }

                    const results = [];
                    let index_buy = null;
                    delta_data.forEach((v, i) => {
                        const hmm = HELPERS.getHMM(new Date(v.x));
                        if (hmm >= 1000 && hmm < 1400) {
                            if (v.y > 0) {
                                if (!index_buy) {
                                    index_buy = i;
                                }
                            } else {
                                if (index_buy) {
                                    const g = round2(data[i].c - data[index_buy].c);
                                    results.push({
                                        s,
                                        hmm: HELPERS.getHMM(new Date(v.x)),
                                        hmm_s: HELPERS.getHMM(new Date(delta_data[index_buy].x)),
                                        g: g < -50 ? -50 : g
                                    });
                                    index_buy = null;
                                }
                            }
                        }
                        if (hmm >= 1559) {
                            if (index_buy) {
                                results.push({ s, hmm_s: delta_data[index_buy].hmm, hmm: v.hmm, g: round2(delta_data[index_buy].y - v.y) });
                                index_buy = null;
                            }
                        }

                    });

                    const gain = round2(HELPERS.reduce_safe(results.map((v) => v.g)));
                    console.log(s, gain, results);
                    g += gain;
                    g_day += gain
                }
            }
            day_gains.push({ date: d, gain: round2(g_day) });
            console.log(`%cDAY GAIN | ${d} | ${round2(g_day).toLocaleString()} `, 'color:aqua;');
        };

        console.table(day_gains);
        console.log(`%cTOTAL GAIN | ${date} | ${round2(g).toLocaleString()} `, 'color:deeppink;');

    }
    async test_auto(symbols_list = 'SOXL', date = '2027-08-03', detail = false) {
        console.log('%c------------------------------------------------------------', 'color:yellow;');

        let g = 0;

        // const symbols = 'MU,SNDK,NBIS,WDC,DRAM,SOXL'.split(',');
        const symbols = symbols_list.split(',');

        const days = [];
        let e = new Date(date).getTime();
        // days.push(date);
        while (e <= Date.now()) {
            const d = new Date(e);
            const dow = d.getDay();
            // if (dow !== 0 && dow !== 6) {
            days.push(HELPERS.getYMD(d));
            // }
            e += (24 * 60 * 60 * 1000);
        }
        console.log(days);
        const day_gains = [];
        for await (const d of days) {
            console.log(d);
            await HELPERS.sleep(500);
            let g_day = 0;
            for await (const s of symbols) {
                let data = await FETCH_DATA.get_data_5min_day(s, d);
                if (data && data.length > 0) {
                    data = HELPERS.clean_data(data);
                    data = HELPERS.extend_data(data);
                    data = HELPERS.normalize_data(data, 10 * 1000);

                    // const seed = 10 * 1000;
                    // const shares = seed / data[0].o;
                    // data = data.map((v, i) => {
                    //     return {
                    //         // ymd: v.
                    //         hmm: HELPERS.getHMM(new Date(v.t)),
                    //         o: round2(v.o * shares),
                    //         h: round2(v.h * shares),
                    //         l: round2(v.l * shares),
                    //         c: round2(v.c * shares),
                    //         d: round2((v.c - v.o) * shares),
                    //         ymd: HELPERS.getYMD(new Date(v.t)),
                    //         e: new Date(v.t).getTime(),
                    //         t: v.t,
                    //         tl: new Date(v.t).toLocaleString(),
                    //     };
                    // });
                    // data.forEach((v)=> {
                    //     v.ymd = HELPERS.getYMD(new Date(v.t));
                    //     v.hmm = HELPERS.getHMM(new Date(v.t));
                    // })

                    let ha_data = calculateHeikinAshi(data);
                    // let ha_data = calculateHeikinAshiClose(data);
                    ha_data = HELPERS.add_side_to_data(ha_data);

                    data = data
                        // .filter((v) => v.ymd === data[data.length - 1].ymd)
                        .filter((v) => v.ymd === data[0].ymd)
                        .filter((v) => v.hmm >= 930 && v.hmm <= 1600)
                        ;
                    if (detail) {
                        console.log(data);
                    }
                    ha_data = ha_data
                        // .filter((v) => v.ymd === ha_data[ha_data.length - 1].ymd)
                        .filter((v) => v.ymd === ha_data[0].ymd)
                        .filter((v) => v.hmm >= 930 && v.hmm <= 1600)
                        ;
                    if (detail) {
                        console.log(ha_data);
                    }

                    ha_data.forEach((v, i) => {
                        v.RC = data[i].c;
                    })
                    const filtered = ha_data.filter((v) => v.side !== '-');
                    filtered.forEach((v, i) => {
                        if (i > 0) {
                            const diff = v.RC - filtered[i - 1].RC;
                            const max_loss = -50
                            if (v.side === 'SELL') {
                                v.G = diff <= max_loss ? max_loss : diff;
                            } else {
                                v.G = 0;
                            }
                        } else {
                            v.G = 0;
                        }
                        v.prev = i > 0 ? filtered[i - 1].hmm : v.hmm;
                    })
                    if (detail) {
                        console.log(filtered);
                    }

                    const analysis = filtered.filter((v, i) => v.G !== 0).map((v) => {
                        return {
                            s,
                            YMD: v.ymd,
                            HMM_S: v.prev,
                            HMM: v.hmm,
                            G: round2(v.G),
                        }
                    });
                    const gain = round2(HELPERS.reduce_safe(analysis.map((v) => v.G)));
                    console.log(s, gain, analysis);
                    g += gain;
                    g_day += gain
                }
            }
            day_gains.push({ date: d, gain: round2(g_day) });
            console.log(`%cDAY GAIN | ${d} | ${round2(g_day).toLocaleString()} `, 'color:aqua;');
        };

        console.table(day_gains);
        console.log(`%cTOTAL GAIN | ${date} | ${round2(g).toLocaleString()} `, 'color:deeppink;');

    }
    async buy_sell_bars(symbol, bars) {
        // console.chart(bars.map((v) => v.y));
        const hmm = HELPERS.getHMM(new Date);
        const second = new Date().getSeconds();

        if (hmm % 1 === 0 && second < 10) {
            const last = bars[bars.length - 1].y;
            if (last >= 0) {
                console.log(`% c B U Y | ${symbol}  | ${last} `, 'background-color:lime;color:black;')
            } else {
                console.log(`% c S E L L | ${symbol}  | ${last} `, 'background-color:red;color:black;')
            }
        }
    }
    async test(n = 7) {
        console.log('%c------------------------------------------------------------', 'color:yellow;');
        // this.iterate_days(async (ymd) => {
        //     return new Promise(async (resolve) => {

        // const is_open = calendar.find((v) => v.date === ymd);
        // if (is_open) {
        // console.log('MARKET OPEN | ', ymd);

        const days = [];
        let g = 0;
        // const symbols = 'MU,NBIS,SNDK,UMC,STX'.split(',');
        // const symbols = 'DRAM,MU,NBIS,NVDA,SOXX,SNDK,UMC,STX,WDC'.split(',');
        const symbols = 'MU,SNDK,NBIS,WDC,DRAM,SOXL'.split(',');
        // const symbols = 'QQQ'.split(',');

        for await (const s of symbols) {
            let data = await FETCH_DATA.get_data(s, '1D', n);
            const buy_power = 40 * 1000;
            const seed = 10 * 1000; //buy_power / symbols.length;
            data = data.map((v, i) => {
                const shares = seed / v.o;
                return {
                    // ymd: v.
                    hmm: v.thm,
                    c: round2(v.c * shares),
                    o: round2(v.o * shares),
                    d: round2((v.c - v.o) * shares),
                    // d2: i === 0 ? round2((v.c - v.o) * shares) : round2((v.c - data[i - 1].c) * shares),
                    s: shares,
                    tl: v.tl,
                };
            });
            const t = round2(data.map((v) => v.d).reduce((p, c) => p + (c < -100 ? -100 : c)));
            console.log(s, data, t);
            g += t < -250 ? -250 : t;
        }
        console.log(`% cTOTAL GAIN | ${n} d | ${round2(g).toLocaleString()} `, 'color:yellow;');
        // }
    }
    async test_timeframe(n = 7) {
        console.log('%c------------------------------------------------------------', 'color:yellow;');
        // this.iterate_days(async (ymd) => {
        //     return new Promise(async (resolve) => {

        // const is_open = calendar.find((v) => v.date === ymd);
        // if (is_open) {
        // console.log('MARKET OPEN | ', ymd);

        const days = [];
        let g = 0;
        // const symbols = 'MU,NBIS,SNDK,UMC,STX'.split(',');
        // const symbols = 'DRAM,MU,NBIS,NVDA,SOXX,SNDK,UMC,STX,WDC'.split(',');
        const symbols = 'MU,SNDK,NBIS,WDC,DRAM,SOXL'.split(',');
        // const symbols = 'QQQ'.split(',');

        for await (const s of symbols) {
            let data = await FETCH_DATA.get_data(s, '1D', n);
            const buy_power = 40 * 1000;
            const seed = 10 * 1000; //buy_power / symbols.length;
            const shares = seed / data[0].o;
            const delta = (data[data.length - 1].c - data[0].o) * shares;

            console.log(s, data, delta);
            g += delta;
        }
        console.log(`% cTOTAL GAIN | ${n} d | ${round2(g).toLocaleString()} `, 'color:yellow;');
        // }
    }
    async test_2(n = 7, symbol_list = 'DRAM,MU,NVDA,SOXX,SNDK,UMC,STX,WDC') {
        console.log('start test');
        let g = 0;
        this.iterate_days(async (ymd) => {
            return new Promise(async (resolve) => {

                if (ymd !== null) {
                    const is_open = calendar.find((v) => v.date === ymd);
                    if (is_open) {

                        let t_d = 0
                        const symbols = symbol_list.split(',');
                        const buy_power = 40 * 1000;
                        // const seed = 10*1000;
                        const seed = buy_power / symbols.length;
                        // let i = 0;
                        for await (const s of symbols) {
                            let data = await FETCH_DATA.get_day_data(s, ymd);
                            if (data) {
                                data = data
                                    .filter((v) => v.thm === 930 || v.thm === 1600)
                                // .map((v, i) => {
                                //     const shares = 1; //seed / v.o;
                                //     return {
                                //         // ymd: v.
                                //         hmm: v.thm,
                                //         c: round2(v.c * shares),
                                //         o: round2(v.o * shares),
                                //         d: round2((v.c - v.o) * shares)
                                //     }
                                // });
                                data.forEach((v, i) => {
                                    if (i > 0 && (i + 1) % 2 === 0) {
                                        const o = data[i - 1].o;
                                        const c = data[i].c;
                                        const shares = 1; //seed / o;
                                        const t = round2((c - o) * shares);
                                        // const t = round2(data.map((v) => v.d).reduce((p, c) => p + c));
                                        // console.log(s, c, o, c - o, t);
                                        t_d += t < -200 ? -200 : t;
                                        g += t;
                                    }
                                });
                            }
                        }
                        console.log(`MARKET OPEN | % c${ymd} | % c${round2(t_d)} | ${round1(t_d / buy_power * 100)}% `, 'color:cyan;', 'color:yellow;');
                    }
                    resolve();
                } else {
                    console.log(`% cTOTAL GAIN | ${n} d | ${round2(g).toLocaleString()} `, 'color:yellow;');
                }
            });
        }, n);
    };
    async test_3(symbol = 'SNDK', ymd = '2026-07-01') {
        const data = (await FETCH_DATA.get_day_data(symbol, ymd)).filter((v) => v.thm === 935 || v.thm === 1600);
        console.log(data);
        const days = [];
        data.forEach((v, i) => {
            if ((i + 1) % 2 === 0) {
                const n = 10000 / data[i - 1].c
                const delta = (v.c - data[i - 1].c) * n;
                days.push(delta < -150 ? -150 : delta);
            }
        });
        console.table(days);
        console.table(days.reduce((p, c) => p + c));
    }
}

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
        console.log(`%cTOTAL GAIN | ${n}d | ${round2(g).toLocaleString()}`, 'color:yellow;');
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
        console.log(`%cTOTAL GAIN | ${n}d | ${round2(g).toLocaleString()}`, 'color:yellow;');
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
                        console.log(`MARKET OPEN | %c${ymd} | %c${round2(t_d)} | ${round1(t_d / buy_power * 100)}%`, 'color:cyan;', 'color:yellow;');
                    }
                    resolve();
                } else {
                    console.log(`%cTOTAL GAIN | ${n}d | ${round2(g).toLocaleString()}`, 'color:yellow;');
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

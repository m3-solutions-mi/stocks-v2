class Account {
    _symbol = 'QQQ';
    constructor() { }
    _get_headers() {
        return {
            accept: 'application/json',
            'APCA-API-KEY-ID': CONFIG.API_KEY,
            'APCA-API-SECRET-KEY': CONFIG.API_SECRET,
        }
    };

    //* CHECK POSITIONS */
    check_positions(account_positions) {
        const max_loss = -100;
        const max_loss_pct = -0.005;
        if (account_positions.length > 0) {
            // let total = account_positions.map((v) => v.gain).reduce((p, c) => p + c);
            // let total_pct = account_positions.map((v) => v.gain_pct).reduce((p, c) => p + c);
            // console.log('POSITIONS TOTAL $', total, ' | ', total_pct, '%');
            // account_positions.forEach((v) => {
            //     if (v.gain_pct <= TRAIL_PCT) {
            //         //* SELL */
            //         // sell(v.name);
            //     }
            // });

            let total = account_positions.map((v) => +(v.unrealized_pl)).reduce((p, c) => p + c);
            let total_pct = account_positions.map((v) => +(v.unrealized_plpc)).reduce((p, c) => p + c) * 100;
            console.log('POSITIONS TOTAL $', round2(total), ' | ', round3(total_pct), '%');
            account_positions.forEach((v) => {
                if ((v.unrealized_plpc * 100) < -1.5) {
                    //* SELL */
                    console.log('%c S E L L ', 'background-color:red;color:white;');
                    // this.sell(v.symbol);
                }
            });
            // console.table(account_positions.map((v)=>{return{s: v.symbol, g: round2(v.unrealized_pl), p: round3(v.unrealized_plpc * 100)}}))
            const obj = {};
            let t_gain = 0;
            let t_seed = 0;
            account_positions.map((v) => {
                console.log(`%c${v.symbol.padEnd(4, ' ')} | $ ${round2(v.unrealized_pl).toString().padEnd(7, ' ')} | ${round3(v.unrealized_plpc * 100)} % | $ ${round(v.cost_basis)}`, 'color:yellow;');
                obj[v.symbol] = {
                    gain: round2(v.unrealized_pl),
                    pct: round1(v.unrealized_plpc * 100),
                    seed: round(v.cost_basis),
                }
                t_gain += round2(v.unrealized_pl);
                t_seed += round(v.cost_basis);
            });
            obj['_TOTAL_'] = {gain: t_gain, pct: round2(t_gain / t_seed * 100), seed: t_seed}
            console.log(obj);
            return obj;
        }
    }
    buy(amount, symbol = CONFIG.SYMBOL) {
        symbol = symbol.replace('-', '/');
        const spend = +(prompt(`BUY | ${symbol}`, amount));
        console.log(symbol, spend);
        if (spend > 10) {
            const payload = {
                side: 'buy',
                type: 'market',
                time_in_force: symbol.indexOf('/USD') > 0 ? 'ioc' : 'day',
                symbol: symbol,
                notional: round2(spend).toString(),
            };
            const options = {
                method: 'POST',
                headers: this._get_headers(),
                body: JSON.stringify(payload),
            };
            let url = `${CONFIG.ACCOUNT_URL}/v2/orders`;
            fetch(url, options)
                .then(res => res.json())
                .then(res => { console.log('BUY', symbol, res); })
                .catch((err) => { console.error('error in buy()', err) });
        } else {
            console.log('cancelled');
        }
    };
    /**
     * CONFIRM PROMPT b/f SELL
     * @param {*} symbol 
     */
    sell(symbol = CONFIG.SYMBOL) {
        symbol = symbol.replace('-', '/');
        if (confirm(`SELL SHARES | ${symbol}`)) {
            console.log('confirmed');
            const options = {
                method: 'DELETE',
                headers: this._get_headers(),
            };
            let url = `${CONFIG.ACCOUNT_URL}/v2/positions/${symbol.replace('/', '')}?percentage=100`;
            fetch(url, options)
                .then(res => res.json())
                .then(res => { console.log('SELL', symbol, res); })
                .catch(err => console.error('error in sell()', err));
        } else {
            console.log('cancelled');
        }
    };
    // _sell(symbol = CONFIG.SYMBOL) {
    //     const options = {
    //         method: 'DELETE',
    //         headers: this._get_headers(),
    //     };
    //     let url = `${CONFIG.ACCOUNT_URL}/v2/positions/${symbol.replace('/', '')}?percentage=100`;
    //     fetch(url, options)
    //         .then(res => res.json())
    //         .then(res => { console.log('SELL', symbol, res); })
    //         .catch(err => console.error('error in sell()', err));
    // };
    liquidate() {
        // console.warn('NOT IMPLEMENTED');
        const options = {
            method: 'DELETE',
            headers: this._get_headers(),
        };
        // https://paper-api.alpaca.markets/v2/positions
        let url = `${CONFIG.ACCOUNT_URL}/v2/positions`;
        fetch(url, options)
            .then(res => res.json())
            .then(res => { console.log('LIQUIDATE', res); })
            .catch(err => console.error('error in liquidate()', err));
    };
    detail() {
        return new Promise((resolve, reject) => {
            const options = {
                method: 'GET',
                headers: this._get_headers(),
            };
            const url = `${CONFIG.ACCOUNT_URL}/v2/account`;
            fetch(url, options)
                .then(res => res.json())
                .then(res => { resolve({ buying_power: res.buying_power, equity: res.equity }); })
                .catch(err => console.error('error in account()', err));
        });
    };
    orders(after = '2026-07-10') {
        // console.warn('NOT IMPLEMENTED');
        return new Promise((resolve, reject) => {
            const options = {
                method: 'GET',
                headers: this._get_headers(),
            };
            const url = `${CONFIG.ACCOUNT_URL}/v2/account/activities?category=trade_activity&after=${after}&direction=desc&page_size=100`;
            fetch(url, options)
                .then(res => res.json())
                .then(res => { resolve(res); })
                .catch(err => console.error('error in account()', err));
        });
    };
    positions() {
        // console.warn('NOT IMPLEMENTED');
        return new Promise((resolve, reject) => {
            const options = {
                method: 'GET',
                headers: this._get_headers(),
            };
            const url = `${CONFIG.ACCOUNT_URL}/v2/positions`;
            fetch(url, options)
                .then(res => res.json())
                .then(res => { resolve(res); })
                .catch(err => console.error('error in positions()', err));
        });
    };
    history(period = '1D', timeframe = '1Min') {
        return new Promise((resolve, reject) => {
            const options = {
                method: 'GET',
                headers: this._get_headers(),
            };
            const url = `${CONFIG.ACCOUNT_URL}/v2/account/portfolio/history?period=${period}&timeframe=${timeframe}&intraday_reporting=extended_hours&pnl_reset=per_day`;
            fetch(url, options)
                .then(res => res.json())
                .then(res => res.timestamp.map((v, i) => { return { e: v * 1000, t: new Date(v * 1000).toLocaleString(), hmm: HELPERS.getHMM(new Date(v * 1000)), net: res.equity[i] } }))
                .then(res => { resolve(res); })
                .catch(err => console.error('error in history()', err));
        });
    };
}
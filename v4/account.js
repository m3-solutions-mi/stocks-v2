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
    buy(amount, symbol = CONFIG.SYMBOL) {
        const spend = +(prompt(`BUY | ${symbol}`, amount));
        console.log(symbol, spend);
        if (spend > 10) {
            const payload = {
                side: 'buy',
                type: 'market',
                time_in_force: 'day',
                symbol: symbol,
                notional: HELPERS.round2(spend).toString(),
            };
            const options = {
                method: 'POST',
                headers: this._get_headers(),
                body: JSON.stringify(payload),
            };
            let url = `${CONFIG.ACCOUNT_URL}/v2/orders`;
            fetch(url, options)
                .then(res => res.json())
                .then(res => { console.log('BUY', symbol, res); resolve(res) })
                .catch((err) => { console.error('error in buy()', err) });
        } else {
            console.log('cancelled');
        }
    };
    sell(symbol = CONFIG.SYMBOL) {
        if (confirm(`SELL SHARES | ${symbol}`)) {
            console.log('confirmed');
            const options = {
                method: 'DELETE',
                headers: this._get_headers(),
            };
            let url = `${CONFIG.ACCOUNT_URL}/v2/positions/${symbol.replace('/', '')}?percentage=100`;
            fetch(url, options)
                .then(res => res.json())
                .then(res => { console.log('SELL', symbol, res); resolve(res); })
                .catch(err => console.error('error in sell()', err));
        } else {
            console.log('cancelled');
        }
    };
    liquidate() {
        console.warn('NOT IMPLEMENTED');
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
    orders() {
        console.warn('NOT IMPLEMENTED');
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

//* ========================= */
//* ALPACA METHODS */
//* ========================= */

//@ BUY SYMBOL */
function buy_symbol(spend = INVEST_AMOUNT, symbol = SELECTED_SYMBOL) {
    const amount = +(prompt(`BUY | ${symbol}`, spend));
    console.log(symbol, amount);
    if (amount > 10) {
        buy(symbol, amount);
    } else {
        console.log('cancelled');
    }
}
// //* BUY SYMBOLS */
// async function buy_symbols(symbols, spend) {
//     for await (const s of symbols.split(',').filter((v, i, a) => a.indexOf(v) === i)) {
//         buy(s, spend);
//         await sleep(500);
//     };
//     console.log('buy_symbols | done');
// }
// //* BUY TOP SYMBOLS */
// async function buy_top_symbols(spend = 2000) {
//     const symbols = RESULTS.TOP_MOVERS.sort((a, b) => b.gain - a.gain).slice(0, 22).map((v) => v.name);
//     for await (const s of symbols) {
//         buy(s, spend);
//         await sleep(500);
//     };
//     console.log('buy_top_20_symbols | done');
// }
//@ SELL SYMBOL */
function sell_symbol(symbol = SELECTED_SYMBOL) {
    // const amount = +(prompt('Enter dollar amount', 250));
    // console.log(SELECTED_SYMBOL, amount);
    // if (amount > 10) {
    //     sell(SELECTED_SYMBOL);
    // }
    if (confirm(`SELL SHARES | ${symbol}`)) {
        console.log('confirmed');
        sell(symbol);
    } else {
        console.log('cancelled');
    }
}
//@ LIQUIDATE SYMBOLS */
function liquidate_symbols() {
    if (confirm(`LIQUIDATE SHARES`)) {
        console.log('confirmed');
        liquidate();
    } else {
        console.log('cancelled');
    }
}

//@ BUY SYMBOL SHARES */
function buy(symbol, spend = INVEST_AMOUNT) {
    return new Promise((resolve, reject) => {
        // body: JSON.stringify({time_in_force: 'day', type: 'trailing_stop', trail_percent: '0.75'})
        // body: JSON.stringify({time_in_force: 'day', type: 'market', trail_percent: '0.75', symbol: 'STRL'})
        const payload = {
            side: 'buy',
            type: 'market',
            time_in_force: 'day',
            symbol: symbol,
            // qty: qty.toString(), // /** quantity to buy */
            notional: round2(spend).toString(), // /** dollar amount to buy */
            // trail_percent: '0.75',
        };
        const options = {
            method: 'POST',
            headers: {
                accept: 'application/json',
                'APCA-API-KEY-ID': ALPACA_KEY,
                'APCA-API-SECRET-KEY': ALPACA_SECRET,
            },
            body: JSON.stringify(payload),
        };
        let url = `${base_url}/v2/orders`;
        fetch(url, options)
            // fetch(url, options('POST', payload))
            .then(res => res.json())
            .then(res => { console.log('BUY', symbol, res); resolve(res) })
            .catch((err) => { console.error('error in buy()', err) });
    });
}
//@ SELL SYMBOL SHARES */
function sell(symbol) {
    return new Promise((resolve, reject) => {
        const options = {
            method: 'DELETE',
            headers: {
                accept: 'application/json',
                'APCA-API-KEY-ID': ALPACA_KEY,
                'APCA-API-SECRET-KEY': ALPACA_SECRET,
            }
        };
        let url = `${base_url}/v2/positions/${symbol.replace('/', '')}?percentage=100`;
        fetch(url, options)
            .then(res => res.json())
            .then(res => { console.log('SELL', symbol, res); resolve(res); })
            .catch(err => console.error('error in sell()', err));
    });
}
//@ LIQUIDATE ALL POSITIONS */
function liquidate() {
    return new Promise((resolve, reject) => {
        const options = {
            method: 'DELETE',
            headers: {
                accept: 'application/json',
                'APCA-API-KEY-ID': ALPACA_KEY,
                'APCA-API-SECRET-KEY': ALPACA_SECRET,
            }
        };
        // https://paper-api.alpaca.markets/v2/positions
        let url = `${base_url}/v2/positions`;
        fetch(url, options)
            .then(res => res.json())
            .then(res => { console.log('LIQUIDATE', res); resolve(res); })
            .catch(err => console.error('error in liquidate()', err));
    });
}
//@ LATEST BARS */
function latest_bars(symbols) {
    return new Promise((resolve, reject) => {
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                'APCA-API-KEY-ID': ALPACA_KEY,
                'APCA-API-SECRET-KEY': ALPACA_SECRET
            }
        };

        fetch(`https://data.alpaca.markets/v2/stocks/bars/latest?symbols=${symbols}`, options)
            .then(res => res.json())
            .then(res => resolve(res))
            .catch(err => console.error('error in latest_bars()', err));
    });
}
//@ TOP N LIST */
function top_N(count = 10) {
    return new Promise((resolve, reject) => {
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                'APCA-API-KEY-ID': ALPACA_KEY,
                'APCA-API-SECRET-KEY': ALPACA_SECRET
            }
        };

        fetch(`https://data.alpaca.markets/v1beta1/screener/stocks/movers?top=${count}`, options)
            .then(res => res.json())
            .then(res => resolve(res))
            .catch(err => console.error('error in latest_bars()', err));
    });
}
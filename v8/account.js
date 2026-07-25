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

            // FETCH_DATA.get_data('^IXIC', '1D', 10).then((ixic) => {
            //     console.log(`%c ^IXIC | ${round3((ixic[ixic.length - 1].c - ixic[ixic.length - 2].c) / ixic[ixic.length - 2].c * 100)} % `,'background-color:orange;color:black;');
            // })

            let total = account_positions.map((v) => +(v.unrealized_pl)).reduce((p, c) => p + c);
            let total_pct = account_positions.map((v) => +(v.unrealized_plpc)).reduce((p, c) => p + c) * 100;
            // console.log('POSITIONS TOTAL $', round2(total), ' | ', round3(total_pct), '%');
            account_positions.forEach((v) => {
                if ((v.unrealized_plpc * 100) < -1.5) {
                    //* SELL */
                    console.log(`%c S E L L  |  ${v.symbol}`, 'background-color:red;color:white;');
                    // this.sell(v.symbol);
                }
            });
            // console.table(account_positions.map((v)=>{return{s: v.symbol, g: round2(v.unrealized_pl), p: round3(v.unrealized_plpc * 100)}}))
            const obj = {};
            let t_gain = 0;
            let t_seed = 0;
            account_positions.map((v) => {
                // console.log(`%c${v.symbol.padEnd(4, ' ')} | $ ${round2(v.unrealized_pl).toString().padEnd(7, ' ')} | ${round3(v.unrealized_plpc * 100)} % | $ ${round(v.cost_basis)}`, 'color:yellow;');
                obj[v.symbol] = {
                    gain: round2(v.unrealized_pl),
                    pct: round1(v.unrealized_plpc * 100),
                    seed: round(v.cost_basis),
                }
                t_gain += round2(v.unrealized_pl);
                t_seed += round(v.cost_basis);
            });
            obj['_TOTAL_'] = { gain: t_gain, pct: round2(t_gain / t_seed * 100), seed: t_seed }
            // console.log(obj);
            return obj;
        } else {
            return { _TOTAL_: { gain: 0, pct: 0, seed: 0 } };
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
    activities(after = '2026-07-10') {
        // console.warn('NOT IMPLEMENTED');
        return new Promise((resolve, reject) => {
            const options = {
                method: 'GET',
                headers: this._get_headers(),
            };
            const url = `${CONFIG.ACCOUNT_URL}/v2/account/activities?category=trade_activity&after=${after}&direction=desc&page_size=100`;
            fetch(url, options)
                .then(res => res.json())
                // .then(res => res.map((v) => {
                //     return {
                //         symbol: v.symbol,
                //         side: v.side,
                //         // price: +(v.price),
                //         // qty: +(v.qty),
                //         net: round2((+(v.price)) * (+(v.qty))),
                //         tl: new Date(v.transaction_time).toLocaleString(),
                //     }
                // }))
                // .then(res => res.filter((v) => v.symbol === 'SOXL'))
                .then(res => { resolve(res); })
                .catch(err => console.error('error in account()', err));
        });
    };
    activities_summary(symbol = 'SOXL') {
        return new Promise(async (resolve, reject) => {
            const all_orders = await this.activities();
            // console.log(this.transformOrdersToPairs(all_orders));
            const transformed = this.transformActivitiesToPairs(
                all_orders
                    .filter((v) => v.symbol === symbol)
            );
            console.log(transformed);
            console.log(transformed.pairs.map((v) => {
                return {
                    symbol: v.symbol,
                    net: v.net,
                    tl_buy: v.buyDate.toLocaleString(),
                    tl_sell: v.sellDate.toLocaleString(),
                }
            }));
            console.log(all_orders.filter((v) => v.symbol === symbol));

            const summary = [];
            let t_sell = 0;
            let t_buy = 0;
            let active = false;
            let total = 0;
            all_orders
                // .filter((v) => v.symbol === symbol)
                .filter((v) => new Date(v.transaction_time).getTime() >= new Date('2026-07-24').getTime())
                // .reverse()
                .forEach((v, i) => {
                    const net = (+(v.price)) + (+(v.qty));
                    const tl = new Date(v.transaction_time).toLocaleString();
                    total = (v.side === 'buy') ? -net : net
                    if (v.side === 'sell') {
                        summary.push([tl, total]);
                    }
                    // if (v.side === 'buy') {
                    //     summary.push(t_sell);
                    //     t_sell = 0;
                    //     t_buy += net;
                    // } else {
                    //     t_sell += net;
                    //     t_buy = 0;
                    // }
                })
            console.log(total, summary);
        });
    }
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
                .then(res => res.timestamp.map((v, i) => { 
                    return { 
                        // e: v * 1000,
                        t: new Date(v * 1000).toLocaleString(),
                        // hmm: HELPERS.getHMM(new Date(v * 1000)),
                        net: round(res.equity[i]),
                        pnl: round(res.profit_loss[i]),
                        pnl_pct: round3(res.profit_loss_pct[i] * 100),
                    } }))
                .then(res => { resolve(res); })
                .catch(err => console.error('error in history()', err));
        });
    };

    /**
 * Transform a list of Alpaca Account Activities (from GET /v2/account/activities
 * or GET /v2/account/activities/{activity_type}) into FIFO-matched buy/sell
 * pairs, each with quantity, entry/exit price, and net P&L.
 *
 * Expects each activity to look like Alpaca's trade activity response, e.g.:
 * {
 *   activity_type: "FILL",       // or "PARTIAL_FILL"
 *   id: "20190524113406977::8efc7b5b-...",
 *   symbol: "AAPL",
 *   side: "buy" | "sell",
 *   qty: "10",
 *   price: "150.25",
 *   cum_qty: "10",
 *   leaves_qty: "0",
 *   order_id: "904837e3-...",
 *   transaction_time: "2024-01-05T14:32:00.977Z",
 *   type: "fill"
 * }
 *
 * Non-trade activities (dividends, interest, journal entries, fees, etc. —
 * anything that isn't FILL/PARTIAL_FILL) are ignored automatically and
 * returned separately in `nonTradeActivities` in case you still want them
 * (e.g. for cash-flow reporting).
 *
 * Matching is FIFO per symbol: the oldest unmatched buy quantity is closed
 * out by the oldest sells first. Leftover buy/sell quantity with no
 * counterpart is returned as "open" (still-held or short) positions.
 *
 * Note: multiple activity records can share the same order_id when an order
 * fills in stages (PARTIAL_FILL, PARTIAL_FILL, ..., FILL). Each record is
 * treated as its own execution, which is correct — Alpaca reports each fill
 * as a separate qty/price event.
 *
 * @param {Array<Object>} activities - raw records from the Alpaca activities API
 * @returns {{ pairs: Array<Object>, open: Array<Object>, nonTradeActivities: Array<Object> }}
 */
    transformActivitiesToPairs(activities) {
        const TRADE_TYPES = new Set(['FILL', 'PARTIAL_FILL']);

        // 1. Split trade fills from everything else, normalize numeric fields
        const nonTradeActivities = activities.filter(
            (a) => !TRADE_TYPES.has(a.activity_type)
        );

        const fills = activities
            .filter((a) => TRADE_TYPES.has(a.activity_type) && Number(a.qty) > 0)
            .map((a) => ({
                id: a.id,
                orderId: a.order_id,
                symbol: a.symbol,
                side: a.side,
                qty: Number(a.qty),
                price: Number(a.price),
                transactionTime: new Date(a.transaction_time),
            }))
            .sort((a, b) => a.transactionTime - b.transactionTime);

        // 2. Group by symbol
        const bySymbol = {};
        for (const f of fills) {
            if (!bySymbol[f.symbol]) bySymbol[f.symbol] = [];
            bySymbol[f.symbol].push(f);
        }

        const pairs = [];
        const open = [];

        // 3. FIFO-match buys and sells within each symbol
        for (const symbol of Object.keys(bySymbol)) {
            const symbolFills = bySymbol[symbol];

            const buyQueue = symbolFills
                .filter((f) => f.side === 'buy')
                .map((f) => ({ ...f }));
            const sellQueue = symbolFills
                .filter((f) => f.side === 'sell')
                .map((f) => ({ ...f }));

            let bi = 0;
            let si = 0;

            while (bi < buyQueue.length && si < sellQueue.length) {
                const buy = buyQueue[bi];
                const sell = sellQueue[si];

                const matchQty = Math.min(buy.qty, sell.qty);
                const grossNet = (sell.price - buy.price) * matchQty;
                const netPercent = buy.price > 0 ? (sell.price - buy.price) / buy.price : null;

                pairs.push({
                    symbol,
                    qty: matchQty,
                    buyActivityId: buy.id,
                    sellActivityId: sell.id,
                    buyOrderId: buy.orderId,
                    sellOrderId: sell.orderId,
                    buyPrice: buy.price,
                    sellPrice: sell.price,
                    buyDate: buy.transactionTime,
                    sellDate: sell.transactionTime,
                    net: round2(grossNet),
                    netPercent: netPercent !== null ? round4(netPercent) : null,
                });

                buy.qty -= matchQty;
                sell.qty -= matchQty;

                if (buy.qty === 0) bi++;
                if (sell.qty === 0) si++;
            }

            // 4. Leftover quantity = open position
            for (let i = bi; i < buyQueue.length; i++) {
                const b = buyQueue[i];
                if (b.qty > 0) {
                    open.push({
                        symbol,
                        side: 'long',
                        qty: b.qty,
                        price: b.price,
                        activityId: b.id,
                        orderId: b.orderId,
                        transactionTime: b.transactionTime,
                    });
                }
            }
            for (let i = si; i < sellQueue.length; i++) {
                const s = sellQueue[i];
                if (s.qty > 0) {
                    open.push({
                        symbol,
                        side: 'short',
                        qty: s.qty,
                        price: s.price,
                        activityId: s.id,
                        orderId: s.orderId,
                        transactionTime: s.transactionTime,
                    });
                }
            }
        }

        // 5. Sort pairs chronologically by sell/close date
        pairs.sort((a, b) => a.sellDate - b.sellDate);

        return { pairs, open, nonTradeActivities };
    }
    /**
 * Transform a list of Alpaca order objects (from GET /v2/orders) into
 * FIFO-matched buy/sell pairs, each with quantity, entry/exit price, and net P&L.
 *
 * Expects each order to look like Alpaca's API response, e.g.:
 * {
 *   id: "...",
 *   symbol: "AAPL",
 *   side: "buy" | "sell",
 *   status: "filled",
 *   filled_qty: "10",
 *   filled_avg_price: "150.25",
 *   filled_at: "2024-01-05T14:32:00Z"
 * }
 *
 * Orders that aren't filled are ignored. Matching is FIFO per symbol:
 * the oldest unmatched buy quantity is closed out by the oldest sells first.
 * Any leftover buy/sell quantity with no counterpart is returned separately
 * as "open" (still-held or short) positions.
 *
 * @param {Array<Object>} orders - raw orders from the Alpaca API
 * @returns {{ pairs: Array<Object>, open: Array<Object> }}
 */
    transformOrdersToPairs(orders) {
        console.log(orders);
        // 1. Keep only filled orders, normalize numeric fields
        const filled = orders
            .filter((o) => o.order_status === 'filled' && Number(o.cum_qty) > 0)
            .map((o) => ({
                id: o.id,
                symbol: o.symbol,
                side: o.side,
                qty: Number(o.qty),
                price: Number(o.filled_avg_price),
                filledAt: new Date(o.filled_at),
            }))
            .sort((a, b) => a.filledAt - b.filledAt);

        // 2. Group by symbol
        const bySymbol = {};
        for (const o of filled) {
            if (!bySymbol[o.symbol]) bySymbol[o.symbol] = [];
            bySymbol[o.symbol].push(o);
        }

        const pairs = [];
        const open = [];

        // 3. FIFO-match buys and sells within each symbol
        for (const symbol of Object.keys(bySymbol)) {
            const orders = bySymbol[symbol];

            // Separate queues of { id, qty, price, filledAt } with mutable qty
            const buyQueue = orders
                .filter((o) => o.side === 'buy')
                .map((o) => ({ ...o }));
            const sellQueue = orders
                .filter((o) => o.side === 'sell')
                .map((o) => ({ ...o }));

            let bi = 0; // buyQueue index
            let si = 0; // sellQueue index

            while (bi < buyQueue.length && si < sellQueue.length) {
                const buy = buyQueue[bi];
                const sell = sellQueue[si];

                const matchQty = Math.min(buy.qty, sell.qty);
                const grossNet = (sell.price - buy.price) * matchQty;
                const netPercent = buy.price > 0 ? (sell.price - buy.price) / buy.price : null;

                pairs.push({
                    symbol,
                    qty: matchQty,
                    buyOrderId: buy.id,
                    sellOrderId: sell.id,
                    buyPrice: buy.price,
                    sellPrice: sell.price,
                    buyDate: buy.filledAt,
                    sellDate: sell.filledAt,
                    net: round2(grossNet),
                    netPercent: netPercent !== null ? round4(netPercent) : null,
                });

                buy.qty -= matchQty;
                sell.qty -= matchQty;

                if (buy.qty === 0) bi++;
                if (sell.qty === 0) si++;
            }

            // 4. Whatever's left in either queue is an open position
            for (let i = bi; i < buyQueue.length; i++) {
                const b = buyQueue[i];
                if (b.qty > 0) {
                    open.push({
                        symbol,
                        side: 'long', // unmatched buy = still-held shares
                        qty: b.qty,
                        price: b.price,
                        orderId: b.id,
                        filledAt: b.filledAt,
                    });
                }
            }
            for (let i = si; i < sellQueue.length; i++) {
                const s = sellQueue[i];
                if (s.qty > 0) {
                    open.push({
                        symbol,
                        side: 'short', // unmatched sell = short exposure
                        qty: s.qty,
                        price: s.price,
                        orderId: s.id,
                        filledAt: s.filledAt,
                    });
                }
            }
        }

        // 5. Sort pairs chronologically by sell date for readability
        pairs.sort((a, b) => a.sellDate - b.sellDate);

        return { pairs, open };
    }

    // function round2(n) {
    //     return Math.round(n * 100) / 100;
    // }

    // function round4(n) {
    //     return Math.round(n * 10000) / 10000;
    // }

    // module.exports = { transformOrdersToPairs };

    /* --------------------------- Example usage ---------------------------
    const { transformOrdersToPairs } = require('./alpacaOrderPairs');
    
    // const orders = await alpacaClient.getOrders({ status: 'closed', limit: 500 });
    const { pairs, open } = transformOrdersToPairs(orders);
    
    console.table(pairs.map(p => ({
      symbol: p.symbol,
      qty: p.qty,
      buy: p.buyPrice,
      sell: p.sellPrice,
      net: p.net,
      netPct: (p.netPercent * 100).toFixed(2) + '%',
    })));
    
    console.log('Open positions:', open);
    ------------------------------------------------------------------------- */
}
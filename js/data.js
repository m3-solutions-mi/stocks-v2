const m3_url = 'https://m3-solutions-mi.com';
// const m3_url = 'http://localhost:3000'
// const m3_minute_days = 2.5;

//@ DAYS */
async function get_symbol_data_days(name) {
    return new Promise(async (resolve, reject) => {
        let url = DATA_SOURCE === 'm3' ?
            //https://m3-solutions-mi.com
            `${m3_url}/${name}/1D/2026-05-01T23:59:59/2027-01-01` :
            `https://data.alpaca.markets/v2/stocks/bars?symbols=${name}&timeframe=1D&start=2026-03-21&end=2027-01-01&feed=iex&limit=5000&sort=asc`;

        // const resp = await fetch(`https://data.alpaca.markets/v2/stocks/bars?symbols=${name}&timeframe=1D&start=2025-04-01&end=2027-01-01&feed=iex&limit=5000&sort=asc`, {
        const resp = await fetch(url, {
            method: 'GET',
            headers: {
                accept: 'application/json',
                'APCA-API-KEY-ID': ALPACA_KEY,
                'APCA-API-SECRET-KEY': ALPACA_SECRET,
            }
        }).then((resp) => resp.json());
        // const data = resp.bars[name];
        resolve(resp.bars[name]);
    });
}
//@ 24 HOUR MINUTES */
async function get_symbol_data_24h(name) {
    return new Promise(async (resolve, reject) => {
        const dow = new Date().getDay();
        const hmm = getHMM(new Date);
        // const start_at = new Date(Date.now() - ((dow === 0 ? 2.5 : (dow === 6 ? 0.75 : 3)) * 24 * 60 * 60 * 1000)).toISOString();
        // const start_at = new Date(Date.now() - ((hmm > 1200 ? 1.25 : 0.5) * 24 * 60 * 60 * 1000)).toISOString();
        const start_at = new Date(Date.now() - (COMPARISON_NUM_DAYS * 24 * 60 * 60 * 1000)).toISOString();
        const end_at = new Date().toISOString();
        // const end_at = (new Date(new Date(start_at).getTime() + ( 12 * 60 * 60 * 1000))).toISOString();
        url = DATA_SOURCE === 'm3' ?
            //https://m3-solutions-mi.com
            `${m3_url}/${name}/1Min/${start_at}/${end_at}` :
            `https://data.alpaca.markets/v2/stocks/bars?symbols=${name}&timeframe=1Min&start=${start_at}&end=${end_at}&feed=iex&limit=5000&sort=asc`;
        // `https://data.alpaca.markets/v2/stocks/bars?symbols=${name}V&start=2025-04-01T04:00:00.000Z&end=2026-05-11T13:24:50.305Z&timeframe=1D&limit=5000&adjustment=raw&feed=iex&sort=asc`;

        // `https://api.alpaca.markets/v2/account/portfolio/history?period=1D&timeframe=1Min&intraday_reporting=extended_hours&pnl_reset=per_day`
        // const resp_2 = await fetch(, {
        const resp = await fetch(url, {
            method: 'GET',
            headers: {
                accept: 'application/json',
                'APCA-API-KEY-ID': ALPACA_KEY,
                'APCA-API-SECRET-KEY': ALPACA_SECRET,
            }
        }).then((resp) => resp.json());
        resolve(resp.bars[name]);
    });
}
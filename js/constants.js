const INVEST_AMOUNT = 1000;
const SEED_AMOUNT = 43500;
const COMPARISON_BUY_AMOUNT = 7500;

const UPDATE_AT = [0, 15, 30, 45];
// const UPDATE_AT = [0, 10, 20, 30, 40, 50];

const COMPARE_PICKS = 'ARM,CRWD,DDOG,DRAM,MRVL,MU,SMCI,SNDK,SOXL,STX,UMC,WDC'.split(',');
const COMPARE_PICKS_2 = 'AMD,CIFR,WOLF'.split(',');
const COMPARE_DEFAULT_SYMBOLS = [
    ...'NQ=F,QQQ,CL=F,^VIX'.split(','),
    ...COMPARE_PICKS, ...'AMD,ARM,AVGO,CIFR,COHR,CRM,CRDO,CRWD,DDOG,DRAM,LASR,LITE,MRVL,MU,PENG,UMC,SMCI,SNDK,SOXL,STRL,STX,WDC,WOLF,WULF'.split(',').sort()
];
const COMPARE_SYMBOLS_LIST = COMPARE_DEFAULT_SYMBOLS.filter((v, i, a) => a.indexOf(v) === i);

// const SEED_AMOUNT = {
//     '2026-05-22': 43500,
// }
const COMPARISON_NUM_DAYS = () => {
    const dow = new Date().getDay();
    return dow === 0 ? 3 : (dow === 6 ? 1.75 : 0.5);
    // return 3;
}

const ALPACA_KEY = localStorage.getItem('KEY') || '';
const ALPACA_SECRET = localStorage.getItem('SECRET') || '';
const TOKEN = localStorage.getItem('TOKEN') || '';
console.log(`${ALPACA_KEY} | ${ALPACA_SECRET} | ${TOKEN}`);

const BUY_AMOUNT = +(localStorage.getItem('BUY_AMOUNT') || '250');
const DATA_SOURCE = localStorage.getItem('DATA_SOURCE') || 'm3';
const CHART_START_DATE = localStorage.getItem('CHART_START_DATE') || '2026-01-01';
console.log(`${BUY_AMOUNT} | ${DATA_SOURCE} | ${CHART_START_DATE}`);

let SELECTED_SYMBOL = 'QQQ';
let INDICATORS = 'QQQ,NDAQ,CL=F,^VIX'.split(','); //'NDAQ,^IXIC,^VIX,CL=F,BTC-USD,ETH-USD'.split(',');
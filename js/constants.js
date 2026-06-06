const INVEST_AMOUNT = 1000;
const SEED_AMOUNT = 43500;
const COMPARISON_NUM_DAYS = 1.5;
const COMPARISON_BUY_AMOUNT = 7500;

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
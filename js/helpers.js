const round = (v) => { return Math.round(v * 1) / 1; }
const round1 = (v) => { return Math.round(v * 10) / 10; }
const round2 = (v) => { return Math.round(v * 100) / 100; }
const round3 = (v) => { return Math.round(v * 1000) / 1000; }
const round4 = (v) => { return Math.round(v * 10000) / 10000; }
const round5 = (v) => { return Math.round(v * 100000) / 100000; }
const round6 = (v) => { return Math.round(v * 1000000) / 1000000; }

// =================================================
// SLEEP
// =================================================
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// =================================================
// COMBINE VALUES
// =================================================
function combine_values(arrayOfArrays) {
    return arrayOfArrays.map(innerArray =>
        innerArray.reduce((acc, curr) => acc + curr, 0)
    );
}

// =================================================
// DEEP CLONE
// =================================================
function deepClone(obj) {
    if (typeof obj !== "object" || obj === null) {
        return obj;
    }

    const clonedObj = Array.isArray(obj) ? [] : {};

    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            clonedObj[key] = deepClone(obj[key]);
        }
    }

    return clonedObj;
}

const add_annotation_x = (x, text = null, color = colors.black, offsetX = 0) => {
    const obj = { x, borderWidth: 2, borderColor: color, fillColor: color, opacity: 1 };
    if (text) {
        obj.label = { text, offsetX, offsetY: 15, orientation: 'horizontal', style: { fontSize: '22px' } };
    }
    return obj;
}
const add_annotation_y = (y, color = colors.black) => {
    const obj = { y, borderColor: color, fillColor: color, opacity: 1 };
    // if (text) {
    //     obj.label  = { text, offsetX, offsetY, style: { fontSize: '22px' } };
    // }
    return obj;
}
const add_annotation_point = (x, y, size = 4.5, color = colors.black, text = null, offsetX = 0, offsetY = 0) => {
    const obj = { x, y, marker: { size, fillColor: color } };
    if (text) {
        obj.label = { text, offsetX, offsetY, style: { fontSize: '22px' } };
    }
    return obj;
}
const add_annotation_point_2 = (x, y, text = null, offsetX = 0, offsetY = 0) => {
    const obj = { x, y, marker: { size: 4.5, fillColor: colors.black } };
    if (text) {
        obj.label = { text, offsetX, offsetY, style: { fontSize: '22px' } };
    }
    return obj;
}

// =================================================
// DEEP CLONE
// =================================================
function deepClone(obj) {
    if (typeof obj !== "object" || obj === null) {
        return obj;
    }

    const clonedObj = Array.isArray(obj) ? [] : {};

    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            clonedObj[key] = deepClone(obj[key]);
        }
    }

    return clonedObj;
}
/**
 * This code calculates the slope and intercept of the trendline using the least squares method.
 * The calculateY function then allows you to get the predicted y-value for any given x-value on the trendline.
 */
function calculateTrendline(data) {
    const n = data.length;

    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumX2 = 0;

    for (let i = 0; i < n; i++) {
        sumX += i;
        sumY += data[i];
        sumXY += i * data[i];
        sumX2 += i * i;
    }

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    return {
        slope: slope,
        intercept: intercept,
        calculateY: function (x) {
            return (this.slope * x) + this.intercept;
        }
    };
}

// =================================================
// GET YEAR-MONTH-DAY
// =================================================
function getHMM(date) {
    const d = new Date(date);
    let hour = '' + d.getHours();
    let minute = '' + d.getMinutes();
    const year = d.getFullYear();

    if (hour.length < 2)
        hour = '0' + hour;
    if (minute.length < 2)
        minute = '0' + minute;

    // return '2025-06-04'
    return ([hour, minute]).join(':');
}
// =================================================
// GET YEAR-MONTH-DAY
// =================================================
function getYMD(date, includeYear = true) {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    // return '2025-06-04'
    return (includeYear ? [year, month, day] : [month, day]).join('-');
}
function getDMMM(date = new Date()) {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const day = date.getDate();
    const month = months[date.getMonth()];

    const formattedDate = `${day}-${month}`;
    return formattedDate; // "4-Apr"
}
function moveColumn(tableId, fromIndex, toIndex) {
    const table = document.getElementById(tableId);
    const rows = table.rows;

    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const cells = row.cells;
        const cellToMove = cells[fromIndex];

        if (toIndex >= cells.length) {
            row.appendChild(cellToMove); // Move to the end
        } else {
            row.insertBefore(cellToMove, cells[toIndex]);
        }
    }
}

function analyze_account(days = true, trim = true) {
    // console.table(RESULTS.PORTFOLIO_HISTORY);
    const deposits = RESULTS.ACTIVITIES.filter((v) => v.activity_type === 'CSD').reverse();
    const history = deepClone(days ? RESULTS.HISTORY_1W_DAY : RESULTS.console.table(analyze_account()));//.filter((v) => v.ymd >= '2026-04-09');

    // TODO: add lastest data point to history
    const invested = [];
    history.equity.forEach((d, i) => {

        const filtered = deposits.filter((v) => new Date(v.created_at).getTime() <= new Date(new Date(history.timestamp[i] * 1000).getTime()))
            .map((v) => +(v.net_amount))
            .reduce((p, c) => p + c);

        // const filtered = deposits
        //     .filter((v) => new Date(deposits[i].created_at).getTime() <= new Date(history.timestamp[i]*1000).getTime())
        //     .map((v) => +(v.net_amount))
        //     .reduce((p, c) => p + c);

        // console.log(filtered);
        invested.push(filtered);
    })
    // console.table(invested);
    const obj = [];
    history.equity.forEach((v, i) => {
        const net = round2(v.equity - invested[i]);
        const delta = i === 0 ? 0 : round2(net - obj[i - 1].net);
        const pct = round1(delta / invested[i] * 100);
        obj.push({
            date: days ? v.ymd : v.tl,
            e: new Date(`${+(history.timestamp[i])}`).getTime(),
            // v: (0 ? (i === 0 ? 0 : round2(v.equity - history[i-1].equity)) - invested[i] : invested[i] - invested[i-1]),
            // delta,
            // net,
            // // equity: v.equity,
            // seed: i === 0 ? invested[i] : invested[i] - invested[i-1],
            equity: v.equity,
            invested: invested[i],
            net,
            delta,
            pct,
        });
        if (i === history.length - 1) {
            const total = {
                date: 'TOTAL',
                e: null,
                equity: '-',
                invested: '-',
                net: '-',
                delta: round2(obj.map((v) => v.delta).reduce((p, c) => p + c)),
                pct: round2(obj.map((v) => v.pct).reduce((p, c) => p + c)),
            };
            const average = {
                date: 'AVERAGE',
                e: null,
                equity: '-',
                invested: '-',
                net: '-',
                delta: round2(total.delta / history.length),
                pct: round2(total.pct / history.length),
            };
            const spacer = {
                date: '-----',
                e: null,
                equity: '-----',
                invested: '-----',
                net: '-----',
                delta: '-----',
                pct: '-----',
            }
            obj.push(spacer);
            obj.push(total);
            obj.push(average);
        }
    })
    // console.table(obj);
    return trim ? obj.filter((v) => v.e !== null) : obj;
}
function analyze_account_2(days = true, trim = true) {
    // console.table(RESULTS.PORTFOLIO_HISTORY);
    const deposits = RESULTS.ACTIVITIES.filter((v) => v.activity_type === 'CSD').reverse();
    const obj = [];
    deposits.forEach((v) => {
        obj.push({ date: v.date, e: new Date(v.date+'T20:00:00Z').getTime(), amount: +(v.net_amount) });
        // obj.push({ date: v.date, e: new Date(v.created_at).getTime(), amount: +(v.net_amount) });
    });
    const obj2 = [];
    let e = new Date(obj[0].date).getTime();
    while (e <= Date.now()) {
        const filtered = obj.filter((v) => v.e <= e);
        const value = filtered.length > 0 ? filtered.map((v) => v.amount).reduce((p, c) => p + c) : 0;
        obj2.push({ date: new Date(e).toISOString().split('T')[0], e: new Date(e).getTime(), amount: value });
        e += (24 * 60 * 60 * 1000);
    }

    // console.table(obj2);
    return obj2;
}
function get_description(name) {
    const nasdaq_description = nasdaq_symbols().filter((v) => v.symbol === name);
    const alpaca_description = stock_symbols_detail.find((v) => v.symbol === name);
    let description = '-';
    description = nasdaq_description && nasdaq_description.length > 0 ? nasdaq_description[0].name : description;
    description = alpaca_description && alpaca_description.length > 0 ? alpaca_description[0].name : description;
    return description.slice(0,30);
    // let description = nasdaq_symbols().filter((v) => v.symbol === name);
    // description = description.length === 0 ?
    //     stock_symbols_detail.find((v) => v.symbol === name) :
    //     description[0];
}

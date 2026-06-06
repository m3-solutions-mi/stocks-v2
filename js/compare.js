const default_compare_symbols = [...'NQ=F,QQQ,CL=F,^VIX'.split(','), ...'AMD,ARM,AVGO,CRM,CRWD,DDOG,DRAM,LASR,LITE,MRVL,MU,UMC,SMCI,SNDK,SOXL,STRL,STX,WDC,WOLF,WULF'.split(',').sort()];
async function load_compare_cards() {
    let i = 0;
    // let symbols_list = RESULTS.POSITIONS.map((v) => v.name);
    // if (symbols_list.length === 0) {
    const symbols_list = default_compare_symbols;
    // }
    for (let s of symbols_list) {
        const picks = ''.split(',');
        const color = RESULTS.POSITIONS.map((v) => v.name).indexOf(s) >= 0 ? 'w3-text-blue' : '';
        const html = `<div class="w3-col s12 m${i === 1 ? 6 : (i < 4 ? 2 : 3)}">
                            <div class="w3-panel w3-border _w3-light-grey w3-padding" style="_height:350px;">
                                <div class="w3-col s12 w3-center">
                                    <div class="w3-xxlarge w3-wide" style="padding-top:25px;">
                                        <i class="${i < 4 ? 'w3-hide' : ''} fa fa-credit-card w3-right w3-xlarge w3-text-red w3-margin-right pointer"
                                            onclick="sell_symbol('${s}')"></i>
                                        <i class="${i < 4 ? 'w3-hide' : ''} fa fa-credit-card w3-right w3-xlarge w3-text-teal w3-margin-right pointer"
                                            onclick="buy_symbol(${COMPARISON_BUY_AMOUNT},'${s}')"></i>
                                        <div class="w3-text-grey w3-xlarge _w3-margin-top">
                                            <i id="compare-indicator" class="fa fa-circle w3-text-${picks.indexOf(s) >= 0 ? 'blue' : 'white'}"></i>
                                            <b id="chart-compare-title-${i + 1}" class="${color}">${s}</b> | 
                                            </b>&nbsp;<b id="chart-compare-title-pct-${i + 1}" style="font-size:24px;"></b><span
                                                class="w3-xlarge w3-text-grey"> %</span>
                                        </div>
                                    </div>
                                    <div id="chart-compare-${i + 1}"></div>
                                </div>
                            </div>
                        </div>`;
        document.getElementById('compare-output').innerHTML += html;
        i++;
    };
}

async function load_compare() {
    // if (document.getElementById('compare-output').innerHTML = '') {
    //     load_compare_cards();
    // }
    let i = 0;
    // const symbols_list = default_compare_symbols;
    // let symbols_list = RESULTS.POSITIONS.map((v) => v.name);
    // if (symbols_list.length === 0) {
    const symbols_list = default_compare_symbols;
    // }
    for await (const s of symbols_list) {
        const data = await get_symbol_data_24h(s);
        // let ha = calculateHeikinAshi(data.map((v) => { return { o: v.o, h: v.h, l: v.l, c: v.c }; }));
        // const last = ha[ha.length-1];
        // console.table(s, round2(last.c - last.o), last);
        update_symbol_chart_24h(compare_charts_map[`chart-compare-${i + 1}`], data, i < 3 ? 190 : 190);
        document.getElementById(`chart-compare-title-${i + 1}`).innerHTML = s;
        if (i > 2) {
            const position = RESULTS.POSITIONS.find((v) => v.name === s);
            const value = position ? position.gain_pct : 0
            document.getElementById(`chart-compare-title-${i + 1}`).style.color = value > 0 ? 'green !important' : (value < 0 ? 'red !important' : '');
            document.getElementById(`chart-compare-title-pct-${i + 1}`).innerHTML = value;
            document.getElementById(`chart-compare-title-pct-${i + 1}`).style.color = value > 0 ? 'green' : (value < 0 ? 'red' : '');
        }
        i++;
    }
}
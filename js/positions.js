//TODO: IMPLIMENT A TRAIL PERCENT (DELTA FROM PEAK)
//TODO?: LIQUIDATE @ TOTAL >= +0.75%

function check_positions() {
    if (RESULTS.POSITIONS.length > 0) {
        let total = RESULTS.POSITIONS.map((v) => v.gain).reduce((p, c) => p + c);
        let total_pct = RESULTS.POSITIONS.map((v) => v.gain_pct).reduce((p, c) => p + c);
        console.log('POSITIONS TOTAL $', total, ' | ', total_pct, '%');
        RESULTS.POSITIONS.forEach((v) => {
            if (v.gain_pct <= TRAIL_PCT) {
                //* SELL */
                // sell(v.name);
            }
        });
    }
}
/**
 * Converts standard OHLC data to Heikin Ashi format.
 * @param {Array} data - Array of objects containing {open, high, low, close}.
 * @returns {Array} - Array of Heikin Ashi objects.
 */
function calculateHeikinAshi(data) {
    if (!data || data.length === 0) return [];

    const haData = [];
    
    // Initial Heikin Ashi bar uses standard OHLC values for its 'Open' reference
    let prevOpen = data[0].o;
    let prevClose = (data[0].o + data[0].h + data[0].l + data[0].c) / 4;

    for (let i = 0; i < data.length; i++) {
        const current = data[i];
        
        // 1. Calculate HA Close (Average of current bar)
        const haClose = (current.o + current.h + current.l + current.c) / 4;
        
        // 2. Calculate HA Open (Midpoint of previous HA candle)
        // For the first candle, we use the standard open/close average or just the open
        const haOpen = i === 0 ? (current.o + current.c) / 2 : (prevOpen + prevClose) / 2;
        
        // 3. Calculate HA High and Low (Extremes of current bar vs HA open/close)
        const haHigh = Math.max(current.h, haOpen, haClose);
        const haLow = Math.min(current.h, haOpen, haClose);

        haData.push({
            o: haOpen,
            h: haHigh,
            l: haLow,
            c: haClose,
            // t: current.timestamp // Preserve timestamp if available
        });

        // Store current HA values as "previous" for the next iteration
        prevOpen = haOpen;
        prevClose = haClose;
    }

    return haData.map((v)=> { return {o: round2(v.o), h: round2(v.h), l: round2(v.l), c: round2(v.c)} });
}
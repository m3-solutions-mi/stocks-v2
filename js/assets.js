class asset {
    SYMBOL = null;
    USE_RAW = false;
    CHART = null;

    constructor(symbol, chart_id, use_raw = false) {
        this.SYMBOL = symbol;
        this.USE_RAW = use_raw;
        this.CHART = new Treemap()
    }
    update(symbol = this.SYMBOL) {
        console.log(`update | ${this.SYMBOL}`);
    }
    chart_options(series) {

    }    
}
class Table {
    elem_id = null;
    elem = null;
    data = null


    template = (columns) => `<table>
        <thead>
            ${columns.map((v) => `<tr>${v}</tr>`)}
        </thead>`;
    template_row = (values) => `
        <tr>
            ${values.map((v) => `<td>${v}</td>`)}
        </tr>`;
    template_row_item = `<td>{0}</td>`;
    template_footer = `</table>`;
    template = (columns, rows) => `
        <table>
            <thead id="thead">
                ${columns.map((v) => `<th>${v}</th>`)}
            </thead>
            
            <tbody id="tbody">
                <tr>
                ${rows.map((v) => `
                    <tr>
                        <td>${v}</td>`)}
                    </tr>
                </tr>
            < tbody >
        </table>
    `;

    constructor(elem_id) {
        this.elem_id = elem_id;
        this.elem = document.getElementById(this.elem_id);
    }
    update(data) {
        this.data = data;
    }
    get_value(row, col) {
    }
    set_value(row, col) {
    }
    summarize(columns) {
    }
    to_csv() {
    }
    store() {
    }
    get() {
    }
}
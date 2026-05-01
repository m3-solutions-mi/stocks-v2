function update_table_2(id, table) {

    //* COLUMNS */
    const template_table_header_schedule = `<th class="" style="border-bottom:2px solid grey;">{1}</th>`;
    let html = '';
    // table[0].push('');
    table[0].forEach((v, i) => {
        html += template_table_header_schedule
            // .replace('{0}', borders.indexOf(i) >= 0 ? 'border-right:1px solid #bdbdbd;' : '')
            .replace('{1}', v)
            // .replace('{2}', hide.indexOf(i) >= 0 ? 'w3-hide' : '');
    });
    document.getElementById(`table-header-${id}`).innerHTML = html;

    //* ROWS */
    html = '';
    let data = table; //.filter((v, i) => v[2] === location);
    // indicator | ▼

    data.forEach((r, x) => {
        if (x > 0 && x <= data.length - 1) {
            html += `<tr class="" style="">`;
            for (let y = 0; y < r.length; y++) {
                let column_value = r[y];
                html += `<td class="" style="${y===0 ? 'font-weight:900;' : ''}${x === data.length - 1 ? 'border-bottom:1px solid' : ''}" contenteditable="false">${column_value}</td>`;
            }
            html += `</tr>`;
        }
    });

    update_table_counts();
    document.getElementById(`table-rows-${id}`).innerHTML = html;
}
class Data {
    CONFIG = {};
    constructor() {
        this.refresh();
    }
    refresh() {
        fetch(`http://localhost:3000/wrm/v1/config`, {})
            // fetch(`../..//wrm/v1/config`, {})
            .then((resp) => resp.json())
            .then((data) => {
                console.log(data);
                this.get_data();
                return data;
            })
    }
    get_data(date_str = '2026-04-17') {
        const promises = [
            fetch(`http://localhost:3000/wrm/v1/config`, {}).then((resp) => resp.json()),
            fetch(`http://localhost:3000/wrm/v1/csv/demo/${date_str}`, {}).then((resp) => resp.json()),
            // fetch(`http://localhost:3000/smi_status/days_summary/${date_str}`, {}).then((resp) => resp.json()),
            // fetch(`http://localhost:3000/smi_status/days_summary/${date_str}`, {}).then((resp) => resp.json()),
            // fetch(`http://localhost:3000/smi_status/days_summary/${date_str}`, {}).then((resp) => resp.json()),
            fetch(`http://localhost:3000/wrm/v1/csv/ama/template`, {}).then((resp) => resp.json()),
            // fetch(`http://localhost:3000/smi_status/week_summary/${date_str}`, {}).then((resp) => resp.json()),
            // fetch(`http://localhost:3000/smi_status/month_summary/${date_str}`, {}).then((resp) => resp.json()),
            // fetch(`http://localhost:3000/smi_status/year_summary/${date_str}`, {}).then((resp) => resp.json()),
        ]
        Promise.allSettled(promises).then((v) => {
            v = v.map((v2) => v2.status === 'fulfilled' ? v2.value : null);
            this.CONFIG = {
                config: v[0],
                yesterday: v[1],
                today: v[2],
                tomorrow: v[3],
                days: v[4],
                week: v[5],
                month: v[6],
                year: v[7],
            };
            console.log(this.CONFIG);
            // this.update_table('', v[1]);
        });
    }
    update_table(id, table, is_schedule = true) {

        //* COLUMNS */
        const template_table_header_schedule = `<th class="{2}" style="border-bottom:2px solid grey;{0}">{1}</th>`;
        let html = '';
        // table[0].push('');
        table[0].forEach((v, i) => {
            html += template_table_header_schedule
                .replace('{0}', borders.indexOf(i) >= 0 ? 'border-right:1px solid #bdbdbd;' : '')
                .replace('{1}', v)
                .replace('{2}', hide.indexOf(i) >= 0 ? 'w3-hide' : '');
        });
        document.getElementById(`table-header-${elem_id}`).innerHTML = html;

        //* ROWS */
        html = '';
        let data = table; //.filter((v, i) => v[2] === location);
        // indicator | ▼

        const col_indexes = {
            operators: table[0].findIndex((v) => v === 'Operator'),
            priorities: table[0].findIndex((v) => v === 'Priority'),
            locations: table[0].findIndex((v) => v === 'Location'),
            units: table[0].findIndex((v) => v === 'Unit'),
            stati: table[0].findIndex((v) => v === 'Status'),
        };
        const units = ['', 'h', 'c'];
        const priorities = ['', '1', '2', '3'];
        const stati = ['', 'RUN', 'REPAIR', 'CHECKS', 'WAIT', 'NO MATERIAL'];
        const operators = ['', 'Bill', 'Dave', 'Jerry', 'Joe', 'Tom', 'Sue'];
        const locations = [
            '', 'TB23', 'TB24', 'TB25',
            'Packout Table 1', 'Packout Table 2', 'Tweak Part #3', 'Hose-Sleeve Cut', 'Pines Pack', 'Eaton Lenpack', 'Kohler',
            'Miic 30 Pack', 'Crippa Pack', 'Crimp', 'Leak Test #1', 'Leak Test #2', 'Leak Test #3'
        ];
        const template_dropdown = (value, values) => `
        <div class="w3-dropdown-hover w3-white" style="width:100%;">
            <div id="" class="w3-white" style="width:100%;"><span class="">${value}</span>
                <span class="w3-right w3-white w3-text-grey">&nbsp;&nbsp;</span></div>
            <div class="_w3-text-green w3-dropdown-content w3-bar-block w3-card"
                style="width:100%;min-width:225px;max-height:400px;overflow-y:auto;">
                ${values.map((v) => {
            return `<a onclick="this.parentElement.parentElement.children[0].children[0].innerHTML='${v}'" class="_w3-hide w3-padding w3-bar-item w3-button">${v === '' ? '&nbsp;' : v}</a>`
        }).join('\n')}
            </div>
        </div>`;
        data.forEach((r, x) => {
            if (x > 0 && x <= data.length - 1) {
                const new_location = x > 1 && r[col_indexes.locations] !== data[x - 1][col_indexes.locations] ? 'border-top:1px solid;' : '';
                html += `<tr class="${x === data.length - 1 ? 'w3-light-grey' : ''}" style="${new_location}${x === data.length - 1 ? 'font-weight:900;' : ''}">`;
                // r.push(x !== data.length - 1 ? '<i class="fa fa-plus-square-o" style="cursor:pointer;"></i>' : '&nbsp;');
                // html += `<tr class="${x === data.length - 1 ? 'w3-light-grey' : ''}" style="">`;
                for (let y = 0; y < r.length; y++) {

                    if (x > 1 && y >= 2 && data[x - 1][y] === r[y]) {
                        r[y] = '';
                    }

                    let column_value = r[y];
                    if (x !== data.length - 1) {
                        column_value = y === col_indexes.locations ? template_dropdown(r[y], locations) : column_value;
                        column_value = y === col_indexes.operators ? template_dropdown(r[y], operators) : column_value;
                        column_value = y === col_indexes.priorities ? template_dropdown(r[y], priorities) : column_value;
                        column_value = y === col_indexes.units ? template_dropdown(r[y], units) : column_value;
                        column_value = y === col_indexes.stati ? column_value = template_dropdown(r[y], stati) : column_value;
                    }
                    const editable = y !== data.length - 1 && y !== 2 && y !== 9 && y !== 10 && y !== 11 && y !== 14 && y !== 15 ? 'true' : 'false';
                    html += `<td class="${hide.indexOf(y) >= 0 ? 'w3-hide' : ''}" style="${borders.indexOf(y) >= 0 ? 'border-right:1px solid #bdbdbd;' : ''}" contenteditable="${editable}" onfocus="window.getSelection().selectAllChildren(this)" onblur="update_table_counts()">${column_value}</td>`;
                }
                html += `</tr>`;
            }
        });

        let qty = table[table.length - 1][col_qty];
        let done = table[table.length - 1][col_done];
        let nc = table[table.length - 1][col_nc];
        let delta = table[table.length - 1][col_delta];

        // let qty = meta.totals.qty;
        // let done = meta.totals.done;
        // let nc = meta.totals.nc;
        // let delta = meta.totals.delta;
        // r = ['', '', 'TOTAL', '', '', '', '', '', qty, '', '', '', done, nc, delta, ''];

        const complete_pct = round1(done / qty * 100);
        const nc_pct = round1(nc / done * 100);
        // const delta_pct = round1(100 - (complete_pct - nc_pct));
        const delta_pct = round1((done - qty) / qty * 100);
        const score_pct = round1(complete_pct * ((100 - delta_pct - nc_pct) / 100));

        document.getElementById('complete').innerHTML = isNaN(complete_pct) ? '-' : complete_pct;
        document.getElementById('nc').innerHTML = isNaN(nc_pct) ? '0' : nc_pct;
        document.getElementById('delta').innerHTML = isNaN(delta_pct) ? '0' : delta_pct;
        document.getElementById('score').innerHTML = isNaN(score_pct) ? '0' : score_pct;

        // html += `<tr class="w3-light-grey" style="border-top:2px solid black !important;border-bottom:2px solid black;">`;
        // for (let x = 0; x < r.length; x++) {
        //     html += `<td class="${x < 2 ? 'w3-hide' : ''}" style="${x === 7 || x === 11 ? 'border-right:1px solid #bdbdbd;' : ''}" contenteditable="false"><b>${r[x]}</b></td>`;
        // }
        // html += `</tr>`;
        update_table_counts();
        document.getElementById(`table-rows-${elem_id}`).innerHTML = html;
    }
}
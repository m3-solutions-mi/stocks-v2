function format_table(id) {
    const table = document.getElementById(`${id}`);
    if (!table) {
        console.error('Table with ID "' + id + '" not found.');
        return;
    }

    const csv_rows = [];
    //* Select all rows (including header rows and body rows)
    const rows = table.querySelectorAll("tr");

    for (let i = 1; i < rows.length; i++) {
        //* Select all cells (td or th) in the current row
        const cols = rows[i].querySelectorAll("td, th");

        for (let j = 0; j < cols.length; j++) {
            if ([0].indexOf(j) >= 0) {
                cols[0].style.color = +(cols[6].innerText.replace('%', '')) >= 0 ? '#4CAF50' : '#e50000'
            }
            if ([4, 5, 6, 7].indexOf(j) >= 0) {
                cols[j].style.color = +(cols[j].innerText.replace('%', '')) >= 0 ? '#4CAF50' : '#e50000'
            }
            if ([0, 5, 6].indexOf(j) >= 0) {
                cols[j].style.fontWeight = 'bold'
            }
            //* Get the text content, escape double quotes, and wrap in quotes
            let cellValue = cols[j].innerText.trim();
            //* Handle commas within data by wrapping the entire field in quotes
            // row.push('"' + cellValue.replace(/"/g, '""') + '"');
        }
    }
}
function exportTableToCSV(tableID, filename) {
    const table = document.getElementById(tableID);
    if (!table) {
        console.error('Table with ID "' + tableID + '" not found.');
        return;
    }

    const csv_rows = [];
    let csv = [];
    //* Select all rows (including header rows and body rows)
    const rows = table.querySelectorAll("tr");

    for (let i = 0; i < rows.length; i++) {
        let row = [];
        //* Select all cells (td or th) in the current row
        const cols = rows[i].querySelectorAll("td, th");

        for (let j = 0; j < cols.length; j++) {
            //* Get the text content, escape double quotes, and wrap in quotes
            let cellValue = cols[j].innerText.trim();
            //* Handle commas within data by wrapping the entire field in quotes
            row.push('"' + cellValue.replace(/"/g, '""') + '"');
        }
        csv_rows.push(row.map((v) => v.replace('"', '').replace('"', '')));
    }
    //* set the index for each row
    const date = document.getElementById('selected-date').value;
    for (let x = 1; x < csv_rows.length; x++) {
        csv_rows[x][0] = x;
        csv_rows[x][1] = date;
        csv_rows[x] = csv_rows[x].map((v) => typeof v === 'string' ? v.replace('\n', '') : v);
        csv_rows[x][11] = csv_rows[x][11].replace('  ▼', '');
    }
    console.table(csv_rows);
    return csv_rows;

    //* Download the CSV file
    // downloadCSV(csv_rows.join('\r\n'), filename);
}
function update_table(table, meta, elem_id, read_only = []) {

    //* COLUMNS */
    const template_table_header_schedule = `<th class="{2}" style="border-bottom:2px solid grey;{0}">{1}</th>`;
    html = '';
    table[0].forEach((v, i) => {
        html += template_table_header_schedule
            .replace('{0}', i === 8 ? 'border-right:1px solid #bdbdbd;' : '')
            .replace('{1}', v)
            .replace('{2}', i < 0 ? 'w3-hide' : '');
    });
    document.getElementById(`table-header-${elem_id}`).innerHTML += html;

    //* ROWS */
    // const template_table_row_schedule = `<tr><td>{0}</td></tr>`;
    html = '';
    let data = table.filter((v, i) => i > 0);
    // data = data.sort((a,b)=>)
    data.forEach((r, i) => {
        html += `<tr>`;
        for (let x = 0; x < r.length; x++) {
            html += `<td class="${x < 0 ? 'w3-hide' : ''}" style="
                ${i === data.length - 1 ? 'border-bottom:1px solid;' : ''}
                ${i === data.length - 1 ? 'border-top:1px solid' : ''};
                ${x === 8 ? 'border-right:1px solid #bdbdbd;border-left:1px solid #bdbdbd;' : ''}
                " contenteditable="${read_only.indexOf(x) < 0 ? 'true' : 'false'}">${r[x]}</td>`;
        }
        html += `</tr>`;
    });

    // let qty = meta.totals?.qty | 0;
    // let done = meta.totals?.done | 0;
    // let nc = meta.totals?.nc | 0;
    // r = ['', '', 'TOTAL', '', '', '', qty, '', done, nc, ''];

    // const complete_pct = round1(done / qty * 100);
    // const nc_pct = round1(nc / done * 100);
    // const delta_pct = round1(100 - (complete_pct - nc_pct));
    // const score_pct = round1(complete_pct * ((100 - nc_pct) / 100));

    // document.getElementById('complete').innerHTML = complete_pct;
    // document.getElementById('nc').innerHTML = nc_pct;
    // document.getElementById('delta').innerHTML = delta_pct;
    // document.getElementById('score').innerHTML = score_pct;
    // html += `<tr class="" style="border-top:2px solid black;border-bottom:2px solid black;">`;
    // for (let x = 0; x < r.length; x++) {
    //     html += `<td class="${x < 2 ? 'w3-hide' : ''}" style="${x === 7 ? 'border-right:1px solid #bdbdbd;' : ''}" contenteditable="false"><b>${r[x]}</b></td>`;
    // }
    // html += `</tr>`;
    document.getElementById(`table-rows-${elem_id}`).innerHTML += html;
}
function update_schedule(table, meta, elem_id) {
    const borders = [7, 10];
    const hide = [0, 1, 4]; //[0, 1, 4, 5, 6, 7];
    const col_qty = table[0].findIndex((v) => v === 'Qty');
    const col_done = table[0].findIndex((v) => v === 'Done');
    const col_nc = table[0].findIndex((v) => v === 'NC');
    const col_delta = table[0].findIndex((v) => v === 'Delta');
    // console.log('col_qty', col_qty);

    //* COLUMNS */
    const template_table_header_schedule = `<th class="{2}" style="border-bottom:2px solid grey;{0}">{1}</th>`;
    html = '';
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
        operators: table[0].findIndex((v) => v.toLowerCase() === 'operator'),
        priorities: table[0].findIndex((v) => v.toLowerCase() === 'priority'),
        locations: table[0].findIndex((v) => v.toLowerCase() === 'location'),
        units: table[0].findIndex((v) => v.toLowerCase() === 'unit'),
        stati: table[0].findIndex((v) => v.toLowerCase() === 'status'),
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
            for (let y = 0; y <= r.length - 1; y++) {

                if (x > 1 && y >= 2 && y <= 6 && data[x - 1][y] === r[y]) {
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
                // const editable = y !== data.length - 1 && y !== 9 && y !== 10 && y !== 11 && y !== 14 && y !== 15 ? 'true' : 'false';
                const editable = y !== data.length - 1 && [2, 5, 6, 7, 12].indexOf(y) < 0 ? 'true' : 'false';
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
function update_schedule_old(table, meta, elem_id) {
    const borders = [7, 10];
    const hide = [0, 1, 4]; //[0, 1, 4, 5, 6, 7];
    const col_qty = table[0].findIndex((v) => v === 'Qty');
    const col_done = table[0].findIndex((v) => v === 'Done');
    const col_nc = table[0].findIndex((v) => v === 'NC');
    const col_delta = table[0].findIndex((v) => v === 'Delta');
    // console.log('col_qty', col_qty);

    //* COLUMNS */
    const template_table_header_schedule = `<th class="{2}" style="border-bottom:2px solid grey;{0}">{1}</th>`;
    html = '';
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
        operators: table[0].findIndex((v) => v.toLowerCase() === 'operator'),
        priorities: table[0].findIndex((v) => v.toLowerCase() === 'priority'),
        locations: table[0].findIndex((v) => v.toLowerCase() === 'location'),
        units: table[0].findIndex((v) => v.toLowerCase() === 'unit'),
        stati: table[0].findIndex((v) => v.toLowerCase() === 'status'),
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

                if (x > 1 && y >= 2 && y <= 5 && data[x - 1][y] === r[y]) {
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
                // const editable = y !== data.length - 1 && y !== 9 && y !== 10 && y !== 11 && y !== 14 && y !== 15 ? 'true' : 'false';
                const editable = y !== data.length - 1 && [2, 5, 6, 7, 12].indexOf(y) < 0 ? 'true' : 'false';
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
function getObjectFromCSV(csv_string) {
    const number_columns = [3, 4, 6, 7];

    const csvToObject = (data, delimiter = ',') => {
        const rows = data.split('\n');

        // Extract headers from the first row and remove it from the rows array
        const headers = rows.shift().split(delimiter).map(header => header.trim());

        // Map the remaining rows to objects
        const result = rows.map((row, i) => {
            const cleanup = (v) => v.trim().replace('"', '').replace('"', '');
            const values = row.split(delimiter).map((value, i2) => {
                let v = cleanup(value);
                v = number_columns.indexOf(i2) >= 0 ? parseFloat(v) : v;
                return v;
            });
            // Use reduce to create an object for each row, mapping headers to values
            const temp = headers.reduce((obj, key, index) => {
                obj[key] = values[index];
                return obj;
            }, {});
            // last = temp;
            return temp;
        });

        console.table(result);
        return result;
    };

    console.log(csvToObject(csv_string));
}

function downloadCSV(csv, filename) {
    let csvFile;
    let downloadLink;

    // Create a Blob object with the CSV data and type
    csvFile = new Blob([csv], { type: "text/csv;charset=utf-8;" });

    // Create a hidden download link element
    downloadLink = document.createElement("a");
    downloadLink.download = filename;
    downloadLink.href = window.URL.createObjectURL(csvFile);
    downloadLink.style.display = "none";

    // Add the link to the DOM, click it, and then remove it
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink); // Clean up after download is triggered
}

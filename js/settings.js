function load_settings() {
    document.getElementById('settings-key').value = ALPACA_SECRET;
    document.getElementById('settings-secret').value = ALPACA_SECRET;
    document.getElementById('settings-token').value = TOKEN;
    document.getElementById('settings-start-date').value = CHART_START_DATE;
    // localStorage.getItem('BUY_AMOUNT', buy_amount) || 250;
    // localStorage.getItem('DATA_SOURCE', data_source) || 'm3';

    document.getElementById('settings-watch-list-grey').value = localStorage.getItem('WATCH_LIST_GREY') || 'AAPL,SNDK';
    document.getElementById('settings-watch-list-orange').value = localStorage.getItem('WATCH_LIST_ORANGE') || '';
    document.getElementById('settings-watch-list-purple').value = localStorage.getItem('WATCH_LIST_PURPLE') || '';
    document.getElementById('settings-watch-list-blue').value = localStorage.getItem('WATCH_LIST_BLUE') || '';
}

function apply_settings() {
    const buy_amount = +(Array.from(document.getElementsByName('settings-amount')).filter((v) => v.checked === true)[0].value);
    const data_source = Array.from(document.getElementsByName('settings-source')).filter((v) => v.checked === true)[0].value;

    localStorage.setItem('KEY', document.getElementById('settings-key').value);
    localStorage.setItem('SECRET', document.getElementById('settings-secret').value);
    localStorage.setItem('TOKEN', document.getElementById('settings-token').value);
    localStorage.setItem('CHART_START_DATE', document.getElementById('settings-start-date').value);
    localStorage.setItem('BUY_AMOUNT', buy_amount);
    localStorage.setItem('DATA_SOURCE', data_source);

    localStorage.setItem('WATCH_LIST_GREY', document.getElementById('settings-watch-list-grey').value);
    localStorage.setItem('WATCH_LIST_ORANGE', document.getElementById('settings-watch-list-orange').value);
    localStorage.setItem('WATCH_LIST_PURPLE', document.getElementById('settings-watch-list-purple').value);
    localStorage.setItem('WATCH_LIST_BLUE', document.getElementById('settings-watch-list-blue').value);

    // ['settings-watch-list-grey', 'settings-watch-list-orange'].forEach((id) => {
    //     let value = document.getElementById(id).value;
    //     if (value) {
    //         console.log(id, '|', value);
    //     }
    // });
}
// async function update() {
//     // This line stops the reload
//     event.preventDefault();

//     // Add your update logic here
//     console.log('CLICKED');

//     const date = document.getElementById('selected-date').value;
//     let payload = exportTableToCSV('table-entries', 'temp.csv');
//     payload = payload.map((v, i) => i === 0 ? v : v.slice(0, -1));
//     payload.forEach((r, i) => {
//         if (i > 0) {
//             if (r[2] === '') { r[2] = payload[i - 1][2]; }
//             if (r[3] === '' && payload[i - 1][2] === r[2]) { r[3] = payload[i - 1][3]; }
//             if (r[4] === '' && payload[i - 1][2] === r[2]) { r[4] = payload[i - 1][4]; }
//             if (r[5] === '' && payload[i - 1][2] === r[2]) { r[5] = payload[i - 1][5]; }
//             if (r[6] === '' && payload[i - 1][2] === r[2]) { r[6] = payload[i - 1][6]; }
//         }
//     })
//     console.log(payload);
//     const response = await fetch(`http://localhost:3000/submit/${date}`, {
//         method: 'POST', // Specify the method
//         headers: {
//             'Content-Type': 'application/json' // Inform the server of the data format
//         },
//         body: JSON.stringify(payload) // Convert the JavaScript object to a JSON string
//     });
// }
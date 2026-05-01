const configuration = {
    doma: '123',
    sectors: ['*'],
    cards: [],
    // reasons: [
    //     'RUN', 'NO MATERIAL', 'SETUP', 'REPAIR'
    //     // 'Running', 'Not Scheduled', 'Waiting on Direction', 'Troubleshooting', 'Setup / Teardown', 'Carry Over','Maintenance',
    //     /*'Lunch'*/
    // ],
    // hours: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
    filed_map: {
        'Location': 'Location',
    },
    locations: [
        'TB23', 'TB24','TB25',
        'Packout Table 1', 'Packout Table 2', 'Tweak Part #3', 'Hose-Sleeve Cut', 'Pines Pack', 'Eaton Lenpack', 'Kohler',
        'Miic 30 Pack', 'Crippa Pack', 'Crimp', 'Leak Test #1', 'Leak Test #2', 'Leak Test #3'
    ],
    schedule_columns: ['Operator', 'Request #', 'Priority', 'Qty', 'Unit', /*'Plan (h)', 'Run (h)',*/ 'Done', 'NC', 'Reason'],
    data: {
        '2026-03-23': [
            // ⬤
            { location: 'TB23', fields: ['Dave', 'WR52159', 1, 7, 'h', 5, '', 'RUN'] },
            { location: 'TB23', fields: ['', '', '', '', 'h', '', 1, 'REPAIR'] },
            { location: 'TB23', fields: ['', '', '', '', 'h', 1, '', 'CHECKS'] },
            { location: 'TB24', fields: ['Jane', '36591', 1, 125, '', 125, '', 'DONE'] },
            { location: 'TB24', fields: ['', '', '', '', '', '', '4', 'SCRAP'] },
            { location: 'Packout Table 1', fields: ['Bill', '2936581', 1, 250, '', 110, '', 'NO MATERIAL', ''] },
            { location: 'Packout Table 1', fields: ['', '195467', 2, 75, '', 75, '', 'DONE'] },
            { location: 'Packout Table 2', fields: ['Jerry', '529467', 1, 45, '', 45, '0', 'DONE'] },
            { location: 'Kohler', fields: ['Tom', '542698', 1, 825, '', 738, '17', 'NO MATERIAL'] },
            { location: 'Kohler', fields: ['', '297654', 2, '', 100, 47, '', 'DONE'] },
            { location: 'Crimp', fields: ['Tom', '542698', 1, 825, '', 738, '17', 'NO MATERIAL'] },
            { location: 'Leak Test #1', fields: ['Jim', '', 1, 75, '', 8, '', 'NO MATERIAL'] },
            // { location: 'Crimp', fields: ['Alan', '', 1, '', 8, '', 'SETUP'] },
            // { location: 'TB23', fields: ['Harold', 'WR42653', 1, 8, 5, '', 'RUN'] },
            // { location: 'TB24', fields: ['Joe', 'WR87512', 1, 6.5, 2, 4.5, 'IT'] },
            // { location: 'TB25', fields: ['', '', '', 8, '', '', 'NOT SCHEDULED'] },
        ],
    },


    //* ---------------------------------------------------------------------------------------------------
    //* TODO */
    // add sectors
    // circle = &#9679

    ideas: [
        'chart scheduled vs plan',
        'https://ag-grid.com/ for table',
        'chart for "vs" | i.e. Run (hrs) vs Quaility, Plan vs Complete',
        //@ 'CALCULATIONS with user Choice: OEE | TEEP | CoQ | Yield %',
    ],
    possible_names: [
        'AIME', 'MAIE', 'TACO', 'OATS', 'SOAD', 'DOA', 'MOA', 'MAO', 'SPENCER',
        'LOUPE', 'EMA', 'MEH !!!',
        'DOGE', 'DOME', 'ATOM',
        'DOMA | Device OEE with Montoring and AI',
        'ETS | Equipment Time Sheet',
        'SPS | Shedule, Plan, Status',
        'PSR | Plan, Status, Report',
        'ROM | Reduced Operation Monitoring',
        'MOR | Monitoing of Operation Reductions',
        'CoQ | Total Cost of Quality',
        'WMD | Work Monitoring Dashboard',
        'WRD | Work Request Dashboard',
    ],
}
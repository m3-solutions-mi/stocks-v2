function get_summary_card(name, gain, percent, color = null, hide_small = false) {
    if (color === null) {
        color = gain > 0 ? 'green' : (gain === 0 ? 'grey' : 'red');
    }
    return `<div class="w3-col s12 m4">
                    <div class="w3-row-padding w3-xlarge">
                        <div class=""><span class="w3-margin-right">${name}</span><b><span id="" class="w3-xxxlarge w3-wide w3-text-${color}">$&nbsp;${gain}</span>
                            </b>&nbsp;<span id="">${percent}%</span></div>
                    </div>
                </div>`;
    // return template;
    //     .replaceAll(template, '{c}', color)
    //     .replaceAll(template, '{n}', name)
    //     .replaceAll(template, '{g}', gain)
    //     .replaceAll(template, '{p}', percent);
}
function get_buy_button(color = 'grey', amount = 100) {
    return ` <span class="w3-hide-small w3-right">
                <i class="fa fa-credit-card w3-xxlarge w3-text-${color} w3-margin-right pointer"
                    onclick="buy_symbol(${amount})"></i>
            </span>`;
}
function get_buying_power(amount = '-') {
    return `<span id="buying-power" class="w3-hide-small w3-xlarge w3-text-blue w3-margin-right w3-wide">$&nbsp;${amount}</span>`;
}


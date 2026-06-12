function update_elem_text(id, v) {
    const elem = document.getElementById(id);
    elem.innerText = round2(v).toLocaleString();
    elem.style.color = v > 0 ? '#4CAF50' : (v === 0 ? 'grey' : '#e50000');
}
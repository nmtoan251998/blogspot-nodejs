document.addEventListener("DOMContentLoaded", () =>{ 
    document.querySelector('#to').value = new Date().toISOString().slice(0,10);
})
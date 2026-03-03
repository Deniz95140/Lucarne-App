const { ipcRenderer } = require('electron') // Création de l'ipc
const ipc = ipcRenderer // Diminution de la variable

const reduceBtn = document.getElementById("reduceBtn");
const closeBtn = document.getElementById("closeBtn");

reduceBtn.addEventListener('click', () => {
    ipc.send("reduceApp")    
})

closeBtn.addEventListener('click', () => {
    ipc.send("closeApp")
})
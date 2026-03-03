const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const ipc = ipcMain;

// Créer une fenêtre
function createWindow() {
    const win = new BrowserWindow({
        width: 500, // largeur 
        height: 600, // hauteur
        minWidth: 500,
        minHeight: 600,
        maxWidth: 650,
        closable: true, // Empeche ou pas la fermeture avec la croix
        maximizable: false, // Empêche l'agrandissement
        resizable: true, // Permet le redimensionnement
        darkTheme: true, // Permet d'activer le darkTheme
        frame: false, // Permet d'affiche ou non la barre du haut par défaut
        opacity: 1, // Définit l'opacité de la fenêtre (0.0 à 1.0)
        backgroundColor: '#232429', // Couleur de fond
        icon: path.join(__dirname, './img/logo.ico'), // Modifier l'icone dans la barre et en haut
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            devTools: true,
            preload: path.join(__dirname, "preload.js") // Appel le script preload lors de la création de la fenetre
        }
    });

    win.loadFile("index.html");
    // win.webContents.openDevTools();

    // Gestion des demandes IPC
    // Top menu
    ipc.on("reduceApp", () => {
        win.minimize();
    });
    
    ipc.on("closeApp", () => {
        win.close();
    });
}

// Quand electron est prêt !
app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

// Gestion de la fermeture de toutes les fenêtres
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})
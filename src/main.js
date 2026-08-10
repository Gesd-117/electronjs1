import { app, BrowserWindow, Menu } from "electron";
import path from "path";

const __dirname = import.meta.dirname;

const createWindow = () => {
	const win = new BrowserWindow({
		width: 800,
		height: 600,
		autoHideMenuBar: true,
		webPreferences: {
			nodeIntegration: false,
		}

	});

    Menu.setApplicationMenu(null);
		
	win.loadFile(path.join(__dirname, '..', 'renderer', 'index.html'));
	
}

app.whenReady().then(createWindow);
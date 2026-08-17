import { app, BrowserWindow, Menu, ipcMain } from "electron";
import path from "path";
import ytdl from '@distube/ytdl-core';

const __dirname = import.meta.dirname;
const indexpath = path.join(__dirname, '..', 'renderer', 'index.html');
const preloadpath = path.join(__dirname, '..', 'preload', 'preload.js');
const iconpath = path.join(__dirname, '..', '..',  'resources', 'icons', 'video.ico' );

const createWindow = () => {
	const win = new BrowserWindow({
		width: 800,
		height: 600,
		autoHideMenuBar: true,
		icon: iconpath,
		webPreferences: {
			preload: preloadpath,
			contextIsolation: true,
			nodeIntegration: false,
		}
	});

    Menu.setApplicationMenu(null);
		
	win.loadFile(indexpath);
	
};

app.whenReady().then(createWindow);

ipcMain.handle('Obtener-info-del-video', async (event, url) => {
	try {
		const info = await ytdl.getInfo(url);
		const formatos = ytdl.filterFormats(info.formats, 'videoandaudio');
		return{
			exito: true,
			titulo: info.videoDetails.title,
			autor: info.videoDetails.author,
			duracion: info.videoDetails.lengthSeconds,
			fecha: info.videoDetails.publishDate,
			thumbnail: info.videoDetails.thumbnails[0].url,
			canal: info.videoDetails.ownerChannelName,
			vistas: info.videoDetails.viewCount,
			formatos: formatos.map((f) => ({
				itag: f.itag,
				calidad: f.qualityLabel,
				formato: f.container,
				longitud: f.contentLength ? ((parseInt(f.contentLength) / 1024) / 1024).toFixed(2) + 'MB' : 'N/A',
			})),
		};
	} catch (e) {
		return {
			exito: false,
			//@ts-ignore
			error: `Error al obtener informacion: ${e.mensaje}`
		};
	};

});
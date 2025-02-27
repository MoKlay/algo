import {app, BrowserWindow, ipcMain} from 'electron'

function createWindow() {
  const win = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
          preload: './preload.js',
          contextIsolation: true,
          nodeIntegration: false
      },
  });

  win.loadFile('./build/index.html');
}

app.whenReady().then(() => {
  createWindow();

  // Обработка сообщения, полученного из рендерингового процесса
  ipcMain.on('data-from-renderer', (event, data) => {
      console.log('Получено сообщение от рендерингового процесса:', data);
      // Отправка ответа обратно в рендеринговый процесс
      event.reply('data-from-main', { message: 'Сообщение получено, спасибо!' });
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
      app.quit();
  }
});
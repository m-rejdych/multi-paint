import http from 'http';
import express from 'express';
import log from 'npmlog';
import path from 'path';
import helmet from 'helmet';
import WebSocket from 'ws';

import { PORT, HOST, __prod__ } from './config';

const init = (): void => {
  const app = express();
  const server = http.createServer(app);
  const wss = new WebSocket.Server({ server });

  app.use(helmet());

  if (__prod__) {
    app.use(
      express.static(path.resolve(__dirname, '..', '..', 'client', 'build')),
    );
  }

  wss.on('connection', (socket) => {
    log.info('CONNECTION', 'Connection opened');

    socket.on('error', (err) => {
      log.error('ERROR', err.message);
    });

    socket.on('close', () => {
      log.info('CLOSE', 'Connection closed');
    })
  })

  server.listen(PORT, HOST, () => {
    log.info('LIFTOFF', `Server is running on http://${HOST}:${PORT}`);
  });
};

init();

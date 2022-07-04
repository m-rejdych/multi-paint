import http from 'http';
import express from 'express';
import log from 'npmlog';
import helmet from 'helmet';
import WebSocket from 'ws';

import { PORT, HOST, __prod__ } from './config';
import errorHandler from './handlers/error';
import roomRoutes from './routes/rooms';
import State from './models/State';
import WebSocketManager from './models/WebSocketManager';

declare module 'express-serve-static-core' {
  interface Request {
    state?: State;
  }
  interface Error {
    status: number;
  }
}

declare module 'ws' {
  class _WS extends WebSocket {}
  export interface WebSocket extends _WS {
    userId?: string;
    roomId?: string;
  }
}

declare global {
  interface Error {
    status?: number;
  }
}

const init = (): void => {
  const app = express();
  const server = http.createServer(app);
  const wss = new WebSocket.Server({ server });
  const state = new State();
  const wsManager = new WebSocketManager(wss, state);

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());
  app.use(helmet());

  app.use('/api/rooms', state.middleware, roomRoutes);
  app.use(errorHandler);

  wsManager.registerHandlers();

  server.listen(PORT, HOST, () => {
    log.info('LIFTOFF', `Server is running on http://${HOST}:${PORT}`);
  });
};

init();

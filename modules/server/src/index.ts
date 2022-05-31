import http from 'http';
import express from 'express';
import log from 'npmlog';
import path from 'path';

import { PORT, HOST, __prod__ } from './config';

const init = (): void => {
  const app = express();
  const server = http.createServer(app);

  if (__prod__) {
    app.use(
      express.static(path.resolve(__dirname, '..', '..', 'client', 'build')),
    );
  }

  server.listen(PORT, HOST, () => {
    log.info('LIFTOFF', `Server is running on http://${HOST}:${PORT}`);
  });
};

init();

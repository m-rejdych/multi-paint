import type { ErrorRequestHandler } from 'express';
import log from 'npmlog';

const errorHandler: ErrorRequestHandler = (error, _, res, __) => {
  log.error('ERROR', error.message);
  res.json({ message: error.message, status: error.status ?? 500 });
};

export default errorHandler;

import type { RequestHandler } from 'express';

import type State from '../models/State';

type StateMiddleware = (state: State) => RequestHandler;

const stateMiddleware: StateMiddleware = (state) => (req, _, next) => {
  req.state = state;
  next();
};

export default stateMiddleware;

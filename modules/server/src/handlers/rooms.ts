import type { RequestHandler } from 'express';

import type Room from '../models/Room';

interface CreateRoomBody {
  roomName: string;
  username: string;
}

export const create: RequestHandler<
  Record<string, never>,
  Room,
  CreateRoomBody
> = (req, res, next) => {
  try {
    if (!req.state) {
      const error = new Error('State is not available.');
      error.status = 500;
      throw error;
    }

    const { username, roomName } = req.body;
    if (!username || !roomName) {
      let message = '';
      if (!username) {
        message += '"username" field is required.';
      }
      if (!roomName) {
        message += `${message ? ' ' : ''}"roomName" field is required.`;
      }

      const error = new Error(message);
      error.status = 400;
      throw error;
    }

    const room = req.state.addRoom(roomName);

    res.status(201).json(room);
  } catch (error) {
    next(error);
  }
};

export const list: RequestHandler<Record<string, never>, Room[]> = (
  req,
  res,
  next,
) => {
  try {
    if (!req.state) {
      const error = new Error('State is not available.');
      error.status = 500;
      throw error;
    }

    res.json(Object.values(req.state.rooms));
  } catch (error) {
    next(error);
  }
};

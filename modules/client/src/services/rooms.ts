import axios, { type AxiosResponse } from 'axios';

import type Room from '../types/Room';
import type { CreateRoomBody } from '../types/http/Rooms';

const API_PREFIX = `/api/rooms` as const;

export const getRooms = async (): Promise<AxiosResponse<Room[]>> =>
  axios.get(API_PREFIX);

export const createRoom = async (
  data: CreateRoomBody,
): Promise<AxiosResponse<Room>> => axios.post(`${API_PREFIX}/create`, data);

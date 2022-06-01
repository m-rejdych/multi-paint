import { config } from 'dotenv';

config();

export const PORT = parseInt(process.env.PORT as string, 10);
export const HOST = process.env.HOST as string;

export const __prod__ = process.env.NODE_ENV === 'production';

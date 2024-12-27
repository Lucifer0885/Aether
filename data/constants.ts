//PRODUCTION
export const TOKEN = process.env.DISCORD_TOKEN as string;
export const CLIENT_ID = process.env.CLIENT_ID as string;

//DEVELOPMENT
export const DEV_TOKEN = process.env.DEV_TOKEN as string;
export const DEV_CLIENT_ID = process.env.DEV_CLIENT_ID as string;
export const DEV_SERVER = process.env.DEV_SERVER_ID as string;
export const DEV_IDS = ['275688865203748865'] as string[];

//DATABASE
export const MONGO_URL = process.env.MONGO_URL as string;
export const DEV_MONGO_URL = process.env.DEV_MONGO_URL as string;

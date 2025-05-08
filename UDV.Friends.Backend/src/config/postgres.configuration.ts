import "dotenv/config";

const PORT = process.env.PORT || "3000";
const DB_USER = process.env.DB_USER || "";
const DB_PORT = process.env.DB_PORT || 5432;
const DB_PASSWORD = process.env.DB_PASSWORD || "";
const DB_DATABASE = process.env.DB_DATABASE || "";
const DB_HOST = process.env.DB_HOST || "localhost";
const DB_LOGGING = process.env.DB_LOGGING || "false";
const CHANNEL = process.env.CHANNEL || "friend_update";
const NODE_ENV = process.env.NODE_ENV || "development";

export { PORT, DB_USER, DB_PORT, DB_HOST, DB_PASSWORD, DB_DATABASE, CHANNEL, NODE_ENV, DB_LOGGING };

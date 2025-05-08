import "dotenv/config";

const PORT = process.env.PORT || "3000";
const DB_USER = process.env.DB_USER || "";
const DB_PORT = process.env.DB_PORT || 5432;
const DB_PASSWORD = process.env.DB_PASSWORD || "";
const DB_DATABASE = process.env.DB_DATABASE || "";
const DB_HOST = process.env.DB_HOST || "localhost";

export { PORT, DB_USER, DB_PORT, DB_HOST, DB_PASSWORD, DB_DATABASE };

import { config } from "dotenv";
config();

export function getConnection() {
  return { connectionString: process.env.DB_CONNECTION_STRING };
}

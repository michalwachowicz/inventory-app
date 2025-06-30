import { Pool } from "pg";
import { getConnection } from "./connection";

export default new Pool(getConnection());

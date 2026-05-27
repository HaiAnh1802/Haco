// =============================================
// PostgreSQL Connection Pool
// Dùng ở server-side API routes
// =============================================
import { Pool } from "pg";

const pool = new Pool({
  host: process.env.DB_HOST || "160.191.50.41",
  port: parseInt(process.env.DB_PORT || "5432"),
  database: process.env.DB_NAME || "hacodb",
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD,
  ssl: false,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
});

export default pool;

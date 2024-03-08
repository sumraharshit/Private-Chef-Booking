import 'dotenv/config';
import pkg from "pg";
const {Pool} = pkg;
const isProduction = process.env.NODE_ENV === "production";
const connectionString = `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_DATABASE}`;

const pool = new Pool({
    connectionString: isProduction ? process.env.DATABASE_URL : connectionString
});

export {pool};
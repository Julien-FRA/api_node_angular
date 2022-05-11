import { createPool, Pool } from 'mysql2/promise';


export class DB {

    private static DbPool: Pool;

    static get Connection() {
        if (!this.DbPool) {
            this.DbPool = createPool({
                host: process.env.DB_HOST || "dbms",
                user: process.env.DB_USER || "api-dev",
                password: process.env.DB_PASS || "api-dev-password",
                database: process.env.DB_DATABASE || "test"
            })
        }

        return this.DbPool;
    }
}
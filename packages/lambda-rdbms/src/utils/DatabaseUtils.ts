import * as pg from "pg";

export async function makeConnection(databaseName: string): Promise<pg.Client> {
    const client = new pg.Client({
        database: databaseName,
        user: process.env.DATABASE_USER!,
        password: process.env.DATABASE_PASSWORD!,
        port: Number(process.env.DATABASE_PORT!),
        host: process.env.DATABASE_HOST!
    });

    await client.connect();
    return client;
}

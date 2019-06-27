import * as pg from "pg";
import * as IORedis from "ioredis";

export interface Global extends NodeJS.Global {
    Connection?: pg.Client;
    Redis?: IORedis.Redis;
}

import * as IORedis from "ioredis";

export function makeConnection(): IORedis.Redis {
    return new IORedis(Number(process.env.REDIS_PORT!), process.env.REDIS_HOST!);
}

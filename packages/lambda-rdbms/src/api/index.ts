import * as _ from "lodash";
import {
    Context,
    EntityPresenterFactory,
    Event,
    Namespace,
    Presenter,
    Route,
    Router,
    SwaggerRoute
} from "vingle-corgi";
import { Global } from "../globals";
import { makeConnection as makeDbConnection } from "../utils/DatabaseUtils";
import { makeConnection as makeRedisConnection } from "../utils/RedisUtils";
import * as Presenters from "./presenters";

const routes: Array<Namespace | Route> = [];

export const router = new Router([
    new SwaggerRoute(
        "/swagger",
        {
            title: "Test RDBMS with Lambda",
            version: "1.0.0",
            definitions: Object.assign(
                {},
                EntityPresenterFactory.schemas(),
                _.mapValues(Presenters, (presenter: Presenter<any, any>) => presenter.outputJSONSchema())
            )
        },
        routes
    ),

    // new Namespace("", {
    //     children: routes
    // })
]);

export const handler = async (event: Event, context: Context) => {
    context.callbackWaitsForEmptyEventLoop = false;

    // connection이 없으면 우겨넣고
    const globalScope = global as Global;
    if (!globalScope.Connection) {
        console.log("Create New Database Connection.");
        globalScope.Connection = await makeDbConnection("postgres");
    }

    if (!globalScope.Redis) {
        console.log("Create New Redis Connection.");
        globalScope.Redis = await makeRedisConnection();
    }

    console.log(globalScope.Redis.status);
    await globalScope.Redis.connect().catch(err => undefined);

    // handler 처리
    return await router.handler()(event, context);
};

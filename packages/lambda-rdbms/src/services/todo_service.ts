import { stripIndents as sql } from "common-tags";
import { Global } from "../globals";
import { Todo } from "../models/todo";

function checkNull<T>(value: T | undefined | null): T | null {
    return !value ? null : value;
}

function checkDate(value: Date | undefined | null): number | null {
    return !value ? null : Math.floor(value.getTime() / 1000);
}

export class TodoService {
    public static readonly globalScope = (global as Global);

    public static async initialSetup() {
        return await this.globalScope.Connection!.query(`CREATE TABLE IF NOT EXISTS todo (
            id SERIAL PRIMARY KEY,
            title text NOT NULL,
            createdAt timestamp NOT NULL,
            description text,
            finishedAt timestamp);`);
    }

    public static async insert(todo: Todo) {
        const parameters = [
            todo.title, checkDate(todo.createdAt), checkNull(todo.description), checkDate(todo.finishedAt)
        ];
        const connection = this.globalScope.Connection!;

        return (await connection.query(sql`
            INSERT INTO todo (title, createdAt, description, finishedAt)
                    VALUES ($1, TO_TIMESTAMP($2), $3, TO_TIMESTAMP($4)) RETURNING *;`, parameters)).rows[0] as Todo;
    }

    public static async bulkInsert(todos: Todo[]) {
        const parameters = todos
            .map(todo => [
                todo.title, checkDate(todo.createdAt), checkNull(todo.description), checkDate(todo.finishedAt)
            ])
            .reduce((prev, next) => [...prev, ...next]);
        const connection = this.globalScope.Connection!;
        const query = sql`
            INSERT INTO todo (title, createdAt, description, finishedAt)
                    VALUES ${Array.from(new Array(todos.length))
                        .map(_ => "($1, TO_TIMESTAMP($2), $3, TO_TIMESTAMP($4))").join(", ")} RETURNING *;`;

        return (await connection.query(query, parameters)).rows as Todo[];
    }

    public static async update(todo: Todo) {
        const parameters = [
            todo.title, checkDate(todo.createdAt), checkNull(todo.description), checkDate(todo.finishedAt), todo.id!
        ];
        const connection = this.globalScope.Connection!;

        return (await connection.query(sql`
            UPDATE todo SET title = $1, createdAt = TO_TIMESTAMP($2),
                            description = $3, finishedAt = TO_TIMESTAMP($4)
                WHERE id = $5 RETURNING *;`, parameters)).rows[0] as Todo;
    }

    public static async delete(id: number) {
        return await (this.globalScope.Connection!).query(sql`DELETE FROM todo WHERE id = $1 RETURNING *;`, [id]);
    }

    public static async bulkDelete(ids: number[]) {
        return await (this.globalScope.Connection!)
            .query(sql`DELETE FROM todo WHERE id in [${ids.join(", ")}] RETURNING *;`);
    }
}

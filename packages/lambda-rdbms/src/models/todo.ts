import { ClassValidator } from "vingle-corgi";

export interface Todo {
    id?: number;
    title: string;
    createdAt: Date;
    description?: string;
    finishedAt?: Date;
}

export class TodoEntity {
    @ClassValidator.IsNumber()
    public id: number;

    @ClassValidator.IsString()
    @ClassValidator.IsNotEmpty()
    public title: string;

    @ClassValidator.IsDate()
    public createdAt: Date;

    @ClassValidator.IsString()
    @ClassValidator.IsOptional()
    public description: string;

    @ClassValidator.IsDate()
    @ClassValidator.IsOptional()
    public finishedAt?: Date;

    public get finished(): boolean {
        return (this.finishedAt !== undefined);
    }
}

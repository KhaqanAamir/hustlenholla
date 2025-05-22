import { HttpStatus, Injectable, OnModuleInit } from "@nestjs/common";
import { Prisma, PrismaClient } from "@prisma/client";
import { CustomResponse } from "../types/types";



@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {

    constructor() {
        super({
            omit: {
                user: {
                    password: true
                }
            }
        } as Prisma.PrismaClientOptions);
    }

    async onModuleInit() {
        await this.$connect()
    }

    public async postData<
        T extends keyof PrismaClient,
        M extends 'create' | 'createMany',
        InputType = T extends `${infer ModelName}Client`
        ? never
        : PrismaClient[T] extends { create(args: infer A): any }
        ? A extends { data: infer D }
        ? D
        : never
        : never
    >(
        modelName: T,
        method: M,
        dataToPost: InputType,
    ): Promise<CustomResponse> {
        try {
            //@ts-ignore
            const result = await this[modelName][method]({
                data: dataToPost
            })
            return {
                error: false,
                msg: `Data successfully inserted into ${String(modelName)}`,
                data: result,
                status: HttpStatus.OK,
            };
        }
        catch (e) {
            return {
                error: true,
                msg: `An error occurred while inserting data into ${String(modelName)}: ${e.message}`,
                data: null,
                status: HttpStatus.INTERNAL_SERVER_ERROR,
            };

        }
    }

    public async getData<
        T extends keyof PrismaClient,
        M extends 'findUnique' | 'findFirst' | 'findMany',
        // @ts-ignore
        Args extends Parameters<this[T][M]>[0]
    >(
        modelName: T,
        method: M,
        args?: Args
    ): Promise<CustomResponse> {
        try {
            // @ts-ignore
            const result = args ? await this[modelName][method](args) : await this[modelName][method]();

            if (!result || (Array.isArray(result) && result.length === 0)) {
                return {
                    error: false,
                    msg: `No data found in ${String(modelName)} matching the criteria`,
                    data: null,
                    status: HttpStatus.NOT_FOUND,
                };
            }

            return {
                error: false,
                msg: `Data successfully fetched from ${String(modelName)}`,
                data: result,
                status: HttpStatus.OK,
            };
        } catch (e) {
            return {
                error: true,
                msg: `Error fetching data from ${String(modelName)}: ${e.message}`,
                data: null,
                status: HttpStatus.INTERNAL_SERVER_ERROR,
            };
        }
    }

    async updateData<
        T extends keyof PrismaClient,
        M extends 'update' | 'updateMany',
        InputType = T extends keyof PrismaClient
        ? PrismaClient[T] extends { [K in M]: (args: infer A) => any }
        ? A
        : never
        : never
    >(
        modelName: T,
        method: M,
        dataToUpdate: InputType
    ): Promise<CustomResponse> {
        try {
            //@ts-ignore
            const result = await this[modelName][method](dataToUpdate)
            return {
                error: false,
                msg: `Data successfully updated into ${String(modelName)}`,
                data: result,
                status: HttpStatus.OK,
            };
        }
        catch (e) {
            return {
                error: true,
                msg: `Error fetching data from ${String(modelName)}: ${e.message}`,
                data: null,
                status: HttpStatus.INTERNAL_SERVER_ERROR,
            };
        }
    }

    public async deleteData<
        T extends keyof PrismaClient,
        M extends 'delete',
        // @ts-ignore
        Args extends Parameters<this[T][M]>[0]
    >(
        modelName: T,
        method: M,
        args?: Args
    ): Promise<CustomResponse> {
        try {
            // @ts-ignore
            const result = args ? await this[modelName][method](args) : await this[modelName][method]();
            return {
                error: false,
                msg: `Data successfully deleted from ${String(modelName)}`,
                data: result,
                status: HttpStatus.OK,
            };
        }
        catch (e) {
            return {
                error: true,
                msg: `Error deleting data from ${String(modelName)}: ${e.message}`,
                data: null,
                status: HttpStatus.INTERNAL_SERVER_ERROR,
            };
        }
    }
}
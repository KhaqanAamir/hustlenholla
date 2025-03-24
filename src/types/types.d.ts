import { HttpStatus } from "@nestjs/common";

export interface CustomResponse<T = any> {
    error: boolean,
    msg: string,
    data?: T,
    status?: HttpStatus,
    count?: any,
    [key: string]: any
}
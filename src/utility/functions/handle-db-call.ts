import { HttpStatus } from "@nestjs/common";
import { CustomResponse } from "src/types/types";

export async function handleDbCall<T>(dbCall: Promise<any>): Promise<CustomResponse<T>> {
    try {
        const result = await dbCall;
        if (result.error) {
            return { error: result.error, msg: result.msg, data: result.data, status: result.status }
        }

        return {
            error: result.error,
            msg: result.msg,
            data: result.data,
            status: result.status || HttpStatus.OK,

        }
    }
    catch (e) {
        return {
            error: true,
            data: null,
            msg: e.message || "Database error",
            status: HttpStatus.INTERNAL_SERVER_ERROR,
        }
    }
}
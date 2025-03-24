import { HttpStatus } from "@nestjs/common";

export function pgToHttpErr(pgError: string): HttpStatus {
    switch (pgError.slice(0, 2)) {
        case '08':
        case '53':
            return HttpStatus.SERVICE_UNAVAILABLE;
        case '09':
        case '25':
        case '2D':
        case '38':
        case '39':
        case '3B':
        case '40':
        case '55':
        case '57':
        case '58':
        case 'F0':
        case 'HV':
        case 'P0':
        case 'XX':
            return HttpStatus.INTERNAL_SERVER_ERROR;
        case '0L':
        case 'OP':
        case '28':
            return HttpStatus.FORBIDDEN;
        case '54':
            return HttpStatus.PAYLOAD_TOO_LARGE;
    }
    switch (pgError) {
        case '23503':
        case '23505':
            return HttpStatus.CONFLICT;
        case '25006':
            return HttpStatus.METHOD_NOT_ALLOWED;
        case 'P0001':
            return HttpStatus.BAD_REQUEST;
        case '42883':
        case '42P01':
            return HttpStatus.NOT_FOUND;
        case '42501':
            return HttpStatus.FORBIDDEN;
    }
    return HttpStatus.BAD_REQUEST;
}
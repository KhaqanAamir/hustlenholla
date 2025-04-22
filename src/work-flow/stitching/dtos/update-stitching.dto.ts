import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";

export class UpdateStitchingDto {
    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber({}, { message: 'worker id must be a number' })
    worker_id: number

    @IsNotEmpty()
    @IsNumber()
    piece_rate: number

    @IsNotEmpty()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OperationsDto)
    operations: OperationsDto[]
}

class OperationsDto {
    @IsNotEmpty()
    @IsString()
    main_operation: string

    @IsNotEmpty()
    @IsString()
    sub_operation: string

    @IsNotEmpty()
    @IsString()
    sub_op_code: string

    @IsNotEmpty()
    @IsNumber()
    quantity: number
}
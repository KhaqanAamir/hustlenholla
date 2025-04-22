import { ORDER_CATEGORY } from "@prisma/client";
import { Type } from "class-transformer";
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";


class FinishingDetails {
    @IsNotEmpty()
    @IsString()
    issued_by: string

    @IsNotEmpty()
    @IsString()
    received_by: string

    @IsNotEmpty()
    @IsString()
    mat_type: string

    @IsNotEmpty()
    @IsString()
    gate_pass: string

    @IsNotEmpty()
    @IsString()
    transition_type: string
}

class Operations {
    @IsNotEmpty()
    @IsString()
    order_type: string

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    order_number: number

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    work_order_number: number

    @IsNotEmpty()
    @IsEnum(ORDER_CATEGORY)
    category: ORDER_CATEGORY

    @IsNotEmpty()
    @IsString()
    product_description: string

    @IsNotEmpty()
    @IsNumber()
    quantity: number
}

export class UpdateWashingDto {
    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => FinishingDetails)
    finishing_details: FinishingDetails

    @IsNotEmpty()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Operations)
    operations: Operations[]
}
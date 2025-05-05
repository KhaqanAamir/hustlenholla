import { ORDER_CATEGORY } from "@prisma/client";
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class RequestedItemsDto {
    @IsNotEmpty()
    @IsString()
    item_description: string

    @IsNotEmpty()
    @IsString()
    item_code: string

    @IsString()
    additional_specifications: string

    @IsEnum(ORDER_CATEGORY)
    category: ORDER_CATEGORY

    @IsNotEmpty()
    @IsString()
    unit: string

    @IsNotEmpty()
    @IsNumber()
    quantity: number

    @IsNotEmpty()
    @IsNumber()
    rate: number

    @IsOptional()
    @IsNumber()
    amount: number

    @IsOptional()
    @IsNumber()
    order_id: number
}
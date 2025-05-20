import { ORDER_CATEGORY } from "@prisma/client";
import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";


export class UpdateRequestedItemsDto {
    @IsOptional()
    @IsString()
    item_description: string

    @IsOptional()
    @IsString()
    item_code: string

    @IsOptional()
    @IsString()
    additional_specifications: string

    @IsOptional()
    @IsEnum(ORDER_CATEGORY)
    category: ORDER_CATEGORY

    @IsOptional()
    @IsString()
    unit: string

    @IsOptional()
    @IsNumber()
    quantity: number

    @IsOptional()
    @IsNumber()
    rate: number

    @IsOptional()
    @IsNumber()
    amount: number
}
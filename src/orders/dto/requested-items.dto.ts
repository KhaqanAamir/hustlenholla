import { IsEmpty, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { REQUESTED_ITEMS } from "src/enums/requested-items.enum";
import { Database } from "src/types/supabase";

export class RequestedItemsDto {
    @IsNotEmpty()
    @IsString()
    item_description: string

    @IsNotEmpty()
    @IsString()
    item_code: string

    @IsString()
    additional_specifications: string

    @IsEnum(REQUESTED_ITEMS)
    category: Database['public']['Enums']['order_category']

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
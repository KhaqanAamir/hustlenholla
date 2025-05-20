import { Transform, Type } from "class-transformer";
import { IsArray, IsDate, IsEmail, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { UpdateRequestedItemsDto } from "./update-requested-items.dto";

export class UpdateOrderDto {
    @IsOptional()
    @IsDate()
    @Transform(({ value }) => new Date(value))
    required_date: string

    @IsOptional()
    @IsString()
    supplier_name: string

    @IsOptional()
    @IsString()
    supplier_address: string

    @IsOptional()
    @IsString()
    @IsEmail()
    customer_email: string

    @IsOptional()
    @IsString()
    remarks: string

    @IsOptional()
    @IsNumber()
    delivery_period: number

    @IsOptional()
    @IsString()
    delivery_destination: string

    @IsOptional()
    @IsString()
    payment_terms: string

    @IsOptional()
    @IsString()
    freight_terms: string

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => UpdateRequestedItemsDto)
    requested_items: UpdateRequestedItemsDto[]

    @IsOptional()
    @IsNumber()
    total_amount: number

    @IsOptional()
    @IsNumber()
    sales_tax: number

    @IsOptional()
    @IsNumber()
    discount: number

    @IsOptional()
    @IsNumber()
    freight: number

    @IsOptional()
    @IsNumber()
    net_amount: number
}
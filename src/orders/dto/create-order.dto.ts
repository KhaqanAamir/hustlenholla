import { Transform, Type } from "class-transformer";
import { IsArray, IsDate, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { RequestedItemsDto } from "./requested-items.dto";

export class CreateOrderDto {

    @IsNotEmpty()
    @IsDate()
    @Transform(({ value }) => new Date(value))
    required_date: string

    @IsNotEmpty()
    @IsString()
    supplier_name: string

    @IsString()
    supplier_address: string

    @IsOptional()
    @IsString()
    @IsEmail()
    customer_email: string

    @IsString()
    remarks: string

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    delivery_period: number

    @IsNotEmpty()
    @IsString()
    delivery_destination: string

    @IsNotEmpty()
    @IsString()
    payment_terms: string

    @IsNotEmpty()
    @IsString()
    freight_terms: string

    @IsNotEmpty()
    @Transform(({ value }) => RequestedItemsDto)
    @ValidateNested({ each: true })
    @Type(() => RequestedItemsDto)
    requested_items: RequestedItemsDto[]

    @IsOptional()
    @IsNumber()
    total_amount: number

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    sales_tax: number

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    discount: number

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    freight: number

    @IsOptional()
    @IsNumber()
    net_amount: number
}
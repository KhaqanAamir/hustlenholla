import { Transform, Type } from "class-transformer";
import { IsArray, IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { RequestedItemsDto } from "./requested-items.dto";


export class CreateOrderDto {

    @IsNotEmpty()
    @IsDate()
    @Transform(({ value }) => new Date(value))
    order_date: string

    @IsNotEmpty()
    @IsDate()
    @Transform(({ value }) => new Date(value))
    required_date: string

    @IsNotEmpty()
    @IsString()
    supplier_name: string

    @IsString()
    supplier_address: string

    @IsString()
    remarks: string

    @IsNotEmpty()
    @IsNumber()
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
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => RequestedItemsDto)
    requested_items: RequestedItemsDto[]

    @IsOptional()
    @IsNumber()
    total_amount: number

    @IsNumber()
    sales_tax: number

    @IsNumber()
    discount: number

    @IsNumber()
    freight: number

    @IsOptional()
    @IsNumber()
    net_amount: number
}
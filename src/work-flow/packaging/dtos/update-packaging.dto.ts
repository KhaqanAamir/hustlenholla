import { ORDER_CATEGORY, UK_SIZE } from "@prisma/client";
import { Type } from "class-transformer";
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString, ValidateNested } from "class-validator";


class PackagingDetails {
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

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    order_id: number

    @IsNotEmpty()
    @IsString()
    customer_name: string

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    order_item_id: number

    @IsNotEmpty()
    @IsString()
    sku_description: string
}

class Quantity_Measurements {
    @IsNotEmpty()
    @IsString()
    @IsEnum(UK_SIZE)
    size: UK_SIZE

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    quantity: number
}


class Operations {
    @IsNotEmpty()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Quantity_Measurements)
    quantity_size_wise: Quantity_Measurements[]

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    gross_weight_per_ctn: number

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    net_weight_per_ctn: number

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    total_gross_weight: number

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    total_sku_per_ctn?: number

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    number_of_ctn?: number
}

export class UpdatePackagingDto {
    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => PackagingDetails)
    packaging_details: PackagingDetails

    @IsNotEmpty()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Operations)
    operations: Operations[]

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    total_quantity: number
}
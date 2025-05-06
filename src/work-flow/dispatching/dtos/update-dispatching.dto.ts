import { Type } from "class-transformer";
import { IsArray, IsDate, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString, ValidateNested } from "class-validator";


class DispactchingDetails {
    @IsNotEmpty()
    @IsString()
    primary_client_address: string

    @IsNotEmpty()
    @IsString()
    shipped_to_address: string

    @IsNotEmpty()
    @IsString()
    inco_terms: string

    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    dc_date: string

    @IsNotEmpty()
    @IsString()
    gate_pass: string

    @IsNotEmpty()
    @IsString()
    vehicle_number: string
}

class Operations {
    @IsNotEmpty()
    @IsString()
    customer_po: string

    @IsNotEmpty()
    @IsString()
    style_no: string

    @IsNotEmpty()
    @IsString()
    secondary_customer: string

    @IsNotEmpty()
    @IsString()
    category: string

    @IsNotEmpty()
    @IsString()
    uqm: string

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    packed_sku: number

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    cin: number

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    gross_weight: number
}

export class UpdateDispatchingDto {
    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => DispactchingDetails)
    dispatching_details: DispactchingDetails

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
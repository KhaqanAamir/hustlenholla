import { DEPARTMENT } from "@prisma/client";
import { Transform, Type } from "class-transformer";
import { IsArray, IsDate, IsEnum, IsIn, IsNotEmpty, IsNumber, IsString, Validate, ValidateNested } from "class-validator";

class RequestDetails {

    @IsNotEmpty()
    @IsEnum(DEPARTMENT)
    requested_by: DEPARTMENT;

    @IsNotEmpty()
    @IsEnum(DEPARTMENT)
    requested_to: DEPARTMENT;

    @IsNotEmpty()
    @IsString()
    tr_id: string;
}

class Operations {
    @IsNotEmpty()
    @IsString()
    item_code: string;

    @IsNotEmpty()
    @IsString()
    material_description: string;

    @IsNotEmpty()
    @IsString()
    ref_GRN_number: string

    @IsNotEmpty()
    @IsNumber()
    rols_count: number

    @IsNotEmpty()
    @IsNumber()
    request_quantity: number

    @IsNotEmpty()
    @IsNumber()
    issue_quantity: number

    @IsNotEmpty()
    @IsIn(['large', 'medium', 'small'], { message: ' Size must be either large, medium or small' })
    units: string
}

export class FabricRequestDto {
    @IsNotEmpty()
    @IsDate()
    @Transform(({ value }) => new Date(value))
    required_date: string;

    @IsNotEmpty()
    @ValidateNested({ each: true })
    @Type(() => RequestDetails)
    request_details: RequestDetails;

    @IsNotEmpty()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Operations)
    operations: Operations[];

    @IsNotEmpty()
    @IsNumber()
    @Type(() => Number)
    total_quantity: number
}
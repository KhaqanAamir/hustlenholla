import { DEPARTMENT } from "@prisma/client";
import { Transform, Type } from "class-transformer";
import { IsArray, IsDate, IsEnum, IsIn, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";


class RequestDetails {

    @IsOptional()
    @IsEnum(DEPARTMENT)
    requested_by: DEPARTMENT;

    @IsOptional()
    @IsEnum(DEPARTMENT)
    requested_to: DEPARTMENT;

    @IsOptional()
    @IsString()
    tr_id: string;
}

class Operations {
    @IsOptional()
    @IsString()
    item_code: string;

    @IsOptional()
    @IsString()
    material_description: string;

    @IsOptional()
    @IsString()
    ref_GRN_number: string

    @IsOptional()
    @IsNumber()
    rols_count: number

    @IsOptional()
    @IsNumber()
    request_quantity: number

    @IsOptional()
    @IsNumber()
    issue_quantity: number

    @IsOptional()
    @IsIn(['large', 'medium', 'small'], { message: ' Size must be either large, medium or small' })
    units: string
}

export class UpdateFabricRequestDto {
    @IsOptional()
    @IsDate()
    @Transform(({ value }) => new Date(value))
    required_date: string;

    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => RequestDetails)
    request_details: RequestDetails;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => Operations)
    operations: Operations[];

    @IsOptional()
    @IsNumber()
    @Type(() => Number)
    total_quantity: number
}
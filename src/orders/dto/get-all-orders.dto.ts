import { IsOptional, IsString, Matches } from "class-validator";


export class GetAllOrdersDto {
    @IsOptional()
    @IsString()
    query: string

    @IsOptional()
    @IsString({ message: 'page_no must be a string' })
    @Matches(/^\d+$/, { message: 'page_no must be a numeric string' })
    page_no?: string;

    @IsOptional()
    @IsString({ message: 'page_no must be a string' })
    @Matches(/^\d+$/, { message: 'page_no must be a numeric string' })
    page_size?: string;
}
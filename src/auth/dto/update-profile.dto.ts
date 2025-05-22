import { IsNotEmpty, IsString } from "class-validator";


export class UpdateProfileDto {
    @IsNotEmpty()
    @IsString()
    first_name: string;

    @IsNotEmpty()
    @IsString()
    last_name: string;
}
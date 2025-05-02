import { IsEmail, IsEnum, IsNotEmpty, IsString, IsStrongPassword } from "class-validator";
import { AuthBaseDto } from "./auth-base.dto";
import { USER_ROLE } from "@prisma/client";

export class UserSignUpDto extends AuthBaseDto {
    @IsNotEmpty()
    @IsString()
    first_name: string

    @IsNotEmpty()
    @IsString()
    last_name: string

    @IsNotEmpty()
    @IsEnum(USER_ROLE)
    role: USER_ROLE
}
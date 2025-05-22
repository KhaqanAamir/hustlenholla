import { USER_ROLE } from "@prisma/client";
import { IsEmail, IsEnum, IsNotEmpty } from "class-validator";


export class InviteUserDto {

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsEnum(USER_ROLE)
    role: USER_ROLE;
}
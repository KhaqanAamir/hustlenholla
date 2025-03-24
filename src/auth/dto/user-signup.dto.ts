import { IsEmail, IsEnum, IsNotEmpty, IsString, IsStrongPassword } from "class-validator";
import { USER_ROLES } from "src/enums/user-roles.enum";
import { Database } from "src/types/supabase";
import { AuthBaseDto } from "./auth-base.dto";

export class UserSignUpDto extends AuthBaseDto {
    @IsNotEmpty()
    @IsString()
    first_name: string

    @IsNotEmpty()
    @IsString()
    last_name: string

    @IsNotEmpty()
    @IsEnum(USER_ROLES)
    role: Database['public']['Enums']['user_roles']
}
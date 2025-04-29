import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { Match } from "src/utility/functions/match.decortor";

export class ResetPasswordDto {

    @IsNotEmpty()
    @IsEmail()
    email: string

    @IsNotEmpty()
    @IsString()
    newPassword: string

    @IsNotEmpty()
    @IsString()
    @Match('newPassword', { message: 'Confirm password must match new password' })
    confirmPassword: string
}
import { IsNotEmpty, IsString } from "class-validator";
import { Match } from "src/utility/functions/match.decortor";


export class SetPasswordDto {
    @IsNotEmpty()
    @IsString()
    password: string;

    @IsNotEmpty()
    @IsString()
    @Match('password', { message: 'Confirm password must match password' })
    confirm_password: string;

    @IsNotEmpty()
    @IsString()
    token: string
}
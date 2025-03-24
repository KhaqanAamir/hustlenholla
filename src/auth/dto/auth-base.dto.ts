import { IsNotEmpty, IsEmail, IsString } from 'class-validator';

export class AuthBaseDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}

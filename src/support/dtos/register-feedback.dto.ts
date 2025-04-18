import { IsEmail, IsString } from "class-validator";

export class RegisterFeedbackDto {
    @IsEmail({}, { message: 'email should be a string' })
    customer_email: string

    @IsString()
    description: string
}
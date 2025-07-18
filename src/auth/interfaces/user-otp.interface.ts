import { OTP_PURPOSE } from "@prisma/client";

// reason to add this interface is because at the controller level, customer will only provides us email. 
//The rest of the data will be generated by the system
export interface UserOtpInterface {
    user_id: string,
    otp: string,
    expires_at: string
    purpose: OTP_PURPOSE,
    used: boolean
}
import { UserOtpEnum } from "src/enums/user-otp.enum";

export interface UserOtpInterface {
    user_id: string,
    otp: string,
    expires_at: string
    purpose: UserOtpEnum,
    used: boolean
}
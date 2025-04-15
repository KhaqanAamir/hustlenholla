import { ISendMailOptions, MailerService } from "@nestjs-modules/mailer";

let mailerService: MailerService

export async function sendMailUsingTemplate(to: string, template: string, subject: string, options: ISendMailOptions) {
    mailerService.sendMail({
        to: to,
        template: template,
        subject: subject,
        context: {
            options
        }
    })
}
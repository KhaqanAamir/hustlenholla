import { Body, Controller, Post } from '@nestjs/common';
import { SupportService } from './support.service';
import { RegisterFeedbackDto } from './dtos/register-feedback.dto';
import { Prisma } from '@prisma/client';

@Controller('support')
export class SupportController {
    constructor(
        private readonly supportService: SupportService
    ) { }

    @Post('register-issue')
    async registerFeedback(
        @Body() body: RegisterFeedbackDto
    ) {
        const data: Prisma.Customer_IssueCreateInput = {
            customer_email: body.customer_email,
            description: body.description
        }
        return await this.supportService.registerFeedback(data)
    }
}

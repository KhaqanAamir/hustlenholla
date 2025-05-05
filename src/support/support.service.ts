import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma_service/prisma.service';
import { Prisma } from '@prisma/client';
import { CustomResponse } from '../types/types';

@Injectable()
export class SupportService {

    constructor(
        private readonly prisma: PrismaService
    ) { }

    async registerFeedback(data: Prisma.Customer_IssueCreateInput): Promise<CustomResponse> {
        try {
            const registerCustomerIssueResponse = await this.prisma.postData('customer_Issue', 'create', data)

            return registerCustomerIssueResponse
        }
        catch (e) {
            return { error: true, msg: `Inernal server error occured, ${e}` }
        }
    }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma_service/prisma.service';

@Injectable()
export class CuttingService {

    constructor(
        private readonly prisma: PrismaService
    ) { }

    async startCuttingStage(orderId: number) {
        try {
            // const cuttingResponse= await this.prisma.postData('item_Cutting',)
        }
        catch (e) {

        }
    }
}

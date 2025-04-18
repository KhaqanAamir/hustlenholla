import { Controller, Get } from '@nestjs/common';
import { CuttingService } from './cutting.service';

@Controller('/cutting')
export class CuttingController {

    constructor(
        private readonly cuttingService: CuttingService
    ) { }

    async startCuttingStage(orderId: number) {
        return await this.cuttingService.startCuttingStage(orderId)
    }
}

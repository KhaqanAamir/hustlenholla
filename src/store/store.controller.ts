import { Controller, Post } from '@nestjs/common';

@Controller('store')
export class StoreController {
    @Post('create-purchase-order')
    async createPurchaseOrder() {
    }
}

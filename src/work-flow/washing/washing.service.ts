import { Injectable } from '@nestjs/common';
import { ORDER_ITEM_CURRENT_STAGE, WASHING_STATUS } from '@prisma/client';
import { PrismaService } from 'src/prisma_service/prisma.service';
import { CustomResponse } from 'src/types/types';
import { UpdateWashingDto } from './dtos/update-washing.dto';

@Injectable()
export class WashingService {

    constructor(
        private readonly prisma: PrismaService
    ) { }

    async startWashing(orderItemId: number): Promise<CustomResponse> {
        try {

            const [createWashingResponse, updateOrderItemResponse] = await this.prisma.$transaction([
                this.prisma.item_Washing.create({
                    data: {
                        order_item_id: orderItemId
                    }
                }),
                this.prisma.order_Item.update({
                    where: { id: orderItemId },
                    data: {
                        current_process: ORDER_ITEM_CURRENT_STAGE.WASHING
                    }
                })
            ]);

            return { error: false, msg: "Washing stage started", data: createWashingResponse };
        }
        catch (e) {
            return { error: true, msg: `Inernal server error occured, ${e}` }
        }
    }

    async getSingleWashingItem(orderItemId: number): Promise<CustomResponse> {
        try {
            const singleRecordResponse = await this.prisma.getData('item_Washing', 'findFirst', {
                where: { order_item_id: orderItemId },
                include: {
                    order_item: { include: { order: { select: { id: true, required_date: true } } } }
                }
            })

            if (singleRecordResponse.error || !singleRecordResponse.data)
                return singleRecordResponse

            singleRecordResponse.data.order_id = singleRecordResponse.data.order_item.order.id

            singleRecordResponse.data.order_item = {
                article: singleRecordResponse.data.order_item.item_description,
                id: singleRecordResponse.data.order_item.id,
                current_process: singleRecordResponse.data.order_item.current_process,
                delivery_date: singleRecordResponse.data.order_item.order.required_date,
                status: singleRecordResponse.data.order_item.status
            }

            delete singleRecordResponse.data.completed_at
            delete singleRecordResponse.data.status
            delete singleRecordResponse.data.order_item_id

            return singleRecordResponse
        }
        catch (e) {
            return { error: true, msg: `Inernal server error occured, ${e}` }
        }
    }

    async updateWashing(washingItemId: number, body: UpdateWashingDto, total_quantity: number, now: Date): Promise<CustomResponse> {
        try {
            const updateWashingResponse = await this.prisma.updateData('item_Washing', 'update',
                {
                    where: { id: washingItemId },
                    data: { ...body, status: WASHING_STATUS.COMPLETED, completed_at: now, total_quantity: total_quantity }
                })

            return updateWashingResponse
        }
        catch (e) {
            return { error: true, msg: `Inernal server error occured, ${e}` }
        }
    }
}

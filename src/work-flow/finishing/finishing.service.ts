import { Injectable } from '@nestjs/common';
import { FINISHING_STATUS, ORDER_ITEM_CURRENT_STAGE } from '@prisma/client';
import { PrismaService } from '../../prisma_service/prisma.service';
import { CustomResponse } from '../../types/types';
import { UpdateFinishingDto } from './dtos/update-finishing.dto';

@Injectable()
export class FinishingService {
    constructor(
        private readonly prisma: PrismaService
    ) { }

    async startFinishing(orderItemId: number): Promise<CustomResponse> {
        try {

            const [createFinishingResponse, updateOrderItemResponse] = await this.prisma.$transaction([
                this.prisma.item_Finishing.create({
                    data: {
                        order_item_id: orderItemId
                    }
                }),
                this.prisma.order_Item.update({
                    where: { id: orderItemId },
                    data: {
                        current_process: ORDER_ITEM_CURRENT_STAGE.FINISHING
                    }
                })
            ]);

            return { error: false, msg: "Finishing stage started", data: createFinishingResponse };
        }
        catch (e) {
            return { error: true, msg: `Inernal server error occured, ${e}` }
        }
    }


    async getSingleFinishingItem(orderItemId: number): Promise<CustomResponse> {
        try {
            const singleRecordResponse = await this.prisma.getData('item_Finishing', 'findUnique', {
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

    async updateFinishing(finishingItemId: number, body: UpdateFinishingDto, total_quantity: number, now: Date): Promise<CustomResponse> {
        try {
            const updateFinshingResponse = await this.prisma.updateData('item_Finishing', 'update',
                {
                    where: { id: finishingItemId },
                    data: { ...body, status: FINISHING_STATUS.COMPLETED, completed_at: now, total_quantity: total_quantity }
                })

            return updateFinshingResponse
        }
        catch (e) {
            return { error: true, msg: `Inernal server error occured, ${e}` }
        }
    }
}

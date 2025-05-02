import { Injectable } from '@nestjs/common';
import { DISPATCHING_STATUS, ORDER_ITEM_CURRENT_STAGE } from '@prisma/client';
import { PrismaService } from 'src/prisma_service/prisma.service';
import { CustomResponse } from 'src/types/types';
import { UpdateDispatchingDto } from './dtos/update-dispatching.dto';

@Injectable()
export class DispatchService {
    constructor(
        private readonly prisma: PrismaService
    ) { }

    async startDispatching(orderItemId: number): Promise<CustomResponse> {
        try {

            const [createDispatchingResponse, updateOrderItemResponse] = await this.prisma.$transaction([
                this.prisma.item_Dispatch.create({
                    data: {
                        order_item_id: orderItemId
                    }
                }),
                this.prisma.order_Item.update({
                    where: { id: orderItemId },
                    data: {
                        current_process: ORDER_ITEM_CURRENT_STAGE.DISPATCHING
                    }
                })
            ]);

            return { error: false, msg: "Dispatching stage started", data: createDispatchingResponse };
        }
        catch (e) {
            return { error: true, msg: `Inernal server error occured, ${e}` }
        }
    }

    async getSingleDispatchingItem(orderItemId: number): Promise<CustomResponse> {
        try {
            const singleRecordResponse = await this.prisma.getData('item_Dispatch', 'findUnique', {
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

    async updateDispatching(dispatchingItemId: number, body: UpdateDispatchingDto, now: Date): Promise<CustomResponse> {
        try {
            const updatePackagingResponse = await this.prisma.updateData('item_Dispatch', 'update',
                {
                    where: { id: dispatchingItemId },
                    data: { ...body, status: DISPATCHING_STATUS.COMPLETED, completed_at: now, }
                })

            return updatePackagingResponse
        }
        catch (e) {
            return { error: true, msg: `Inernal server error occured, ${e}` }
        }
    }
}

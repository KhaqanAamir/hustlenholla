import { Injectable } from '@nestjs/common';
import { ORDER_ITEM_CURRENT_STAGE, WASHING_STATUS } from '@prisma/client';
import { PrismaService } from '../../prisma_service/prisma.service';
import { CustomResponse } from '../../types/types';
import { UpdateWashingDto } from './dtos/update-washing.dto';

@Injectable()
export class WashingService {

    constructor(
        private readonly prisma: PrismaService
    ) { }

    async startWashing(orderItemId: number): Promise<CustomResponse> {
        try {
            const createWashingResponse = await this.prisma.postData('item_Washing', 'create', {
                order_item_id: orderItemId
            })

            return createWashingResponse
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
            const now = new Date()
            const result = await this.prisma.$transaction(async (tx) => {

                const washingUpdate = await tx.item_Washing.update({
                    where: { id: washingItemId },
                    //@ts-ignore
                    data: {
                        ...body,
                        status: WASHING_STATUS.COMPLETED,
                        completed_at: now,
                        total_quantity: total_quantity
                    },
                    include: {
                        order_item: {
                            select: { current_process: true }
                        }
                    }
                });

                //@ts-ignore
                if (washingUpdate.order_item.current_process === ORDER_ITEM_CURRENT_STAGE.WASHING) {
                    // Step 3: Update order_Item
                    await tx.order_Item.update({
                        where: { id: washingUpdate.order_item_id },
                        data: { current_process: ORDER_ITEM_CURRENT_STAGE.FINISHING }
                    });

                    // Step 4: Create FINISHING stage
                    await tx.item_Finishing.create({
                        data: {
                            order_item_id: washingUpdate.order_item_id
                        }
                    });
                }
                return washingUpdate;
            });

            return { error: false, msg: "Washing stage updated", data: result }
        }
        catch (e) {
            return { error: true, msg: `Inernal server error occured, ${e}` }
        }
    }
}

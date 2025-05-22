import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma_service/prisma.service';
import { CustomResponse } from '../../types/types';
import { UpdateCuttingDto } from './dtos/update-cutting.dto';
import { CUTTING_STATUS, ORDER_ITEM_CURRENT_STAGE } from '@prisma/client';

@Injectable()
export class CuttingService {
    constructor(
        private readonly prisma: PrismaService
    ) { }

    async startCutting(orderItemId: number): Promise<CustomResponse> {
        try {

            const createCuttingResponse = await this.prisma.postData('item_Cutting', 'create', {
                order_item_id: orderItemId
            })

            return createCuttingResponse
        }
        catch (e) {
            return { error: true, msg: `Inernal server error occured, ${e}` }
        }
    }

    async getSingleCuttingItem(orderItemId: number): Promise<CustomResponse> {
        try {
            const singleRecordResponse = await this.prisma.getData('item_Cutting', 'findFirst', {
                where: { order_item_id: orderItemId },
                include: {
                    order_item: { include: { order: { select: { required_date: true } } } }
                }
            })

            if (singleRecordResponse.error || !singleRecordResponse.data)
                return singleRecordResponse

            singleRecordResponse.data.order_item = {
                order_item: {
                    article: singleRecordResponse.data.order_item.item_description,
                    id: singleRecordResponse.data.order_item.id,
                    current_process: singleRecordResponse.data.order_item.current_process,
                    delivery_date: singleRecordResponse.data.order_item.order.required_date,
                    status: singleRecordResponse.data.order_item.status
                },
            }

            delete singleRecordResponse.data.completed_at
            delete singleRecordResponse.data.status

            return singleRecordResponse
        }
        catch (e) {
            return { error: true, msg: `Inernal server error occured, ${e}` }
        }
    }

    async updateCutting(cuttingItemId: number, body: UpdateCuttingDto, total_quantity: number, now: Date): Promise<CustomResponse> {
        try {
            const now = new Date()
            const result = await this.prisma.$transaction(async (tx) => {

                const cuttingUpdate = await tx.item_Cutting.update({
                    where: { id: cuttingItemId },
                    //@ts-ignore
                    data: {
                        ...body,
                        status: CUTTING_STATUS.COMPLETED,
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
                if (cuttingUpdate.order_item.current_process === ORDER_ITEM_CURRENT_STAGE.CUTTING) {
                    // Step 3: Update order_Item
                    await tx.order_Item.update({
                        where: { id: cuttingUpdate.order_item_id },
                        data: { current_process: ORDER_ITEM_CURRENT_STAGE.STITCHING }
                    });

                    // Step 4: Create stitching stage
                    await tx.item_Stitching.create({
                        data: {
                            order_item_id: cuttingUpdate.order_item_id
                        }
                    });
                }
                return cuttingUpdate;
            });

            return { error: false, msg: "Cutting stage updated", data: result }
        }
        catch (e) {
            return { error: true, msg: `Inernal server error occured, ${e}` }
        }
    }
}

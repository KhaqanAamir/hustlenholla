import { Injectable } from '@nestjs/common';
import { ORDER_ITEM_CURRENT_STAGE, STITCHING_STATUS } from '@prisma/client';
import { PrismaService } from '../../prisma_service/prisma.service';
import { CustomResponse } from '../../types/types';
import { UpdateStitchingDto } from './dtos/update-stitching.dto';

@Injectable()
export class StitchingService {

    constructor(
        private readonly prisma: PrismaService
    ) { }

    async startStitching(orderItemId: number): Promise<CustomResponse> {
        try {
            const createStitchingResponse = await this.prisma.postData('item_Stitching', 'create', {
                order_item_id: orderItemId
            })

            return createStitchingResponse
        }
        catch (e) {
            return { error: true, msg: `Inernal server error occured, ${e}` }
        }
    }

    async getSingleStitchingItem(orderItemId: number): Promise<CustomResponse> {
        try {
            const singleRecordResponse = await this.prisma.getData('item_Stitching', 'findFirst', {
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

    async updateStitching(stitchingItemId: number, body: UpdateStitchingDto, total_quantity: number, now: Date): Promise<CustomResponse> {
        try {
            const now = new Date()
            const result = await this.prisma.$transaction(async (tx) => {

                const stitchingUpdate = await tx.item_Stitching.update({
                    where: { id: stitchingItemId },
                    //@ts-ignore
                    data: {
                        ...body,
                        status: STITCHING_STATUS.COMPLETED,
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
                if (stitchingUpdate.order_item.current_process === ORDER_ITEM_CURRENT_STAGE.STITCHING) {
                    // Step 3: Update order_Item
                    await tx.order_Item.update({
                        where: { id: stitchingUpdate.order_item_id },
                        data: { current_process: ORDER_ITEM_CURRENT_STAGE.WASHING }
                    });

                    // Step 4: Create Washing stage
                    await tx.item_Washing.create({
                        data: {
                            order_item_id: stitchingUpdate.order_item_id
                        }
                    });
                }
                return stitchingUpdate;
            });

            return { error: false, msg: "Stitching stage updated", data: result }
        }
        catch (e) {
            return { error: true, msg: `Inernal server error occured, ${e}` }
        }
    }

}

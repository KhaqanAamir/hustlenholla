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

            const [createCuttingResponse, updateOrderItemResponse] = await this.prisma.$transaction([
                this.prisma.item_Cutting.create({
                    data: {
                        order_item_id: orderItemId
                    }
                }),
                this.prisma.order_Item.update({
                    where: { id: orderItemId },
                    data: {
                        current_process: ORDER_ITEM_CURRENT_STAGE.CUTTING
                    }
                })
            ]);

            return { error: false, msg: "Cutting stage started", data: createCuttingResponse };
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
            const updateCuttingResponse = await this.prisma.updateData('item_Cutting', 'update',
                {
                    where: { id: cuttingItemId },
                    data: { ...body, status: CUTTING_STATUS.COMPLETED, completed_at: now, total_quantity: total_quantity }
                })

            return updateCuttingResponse
        }
        catch (e) {
            return { error: true, msg: `Inernal server error occured, ${e}` }
        }
    }
}

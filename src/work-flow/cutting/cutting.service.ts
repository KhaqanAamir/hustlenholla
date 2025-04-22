import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma_service/prisma.service';
import { CustomResponse } from 'src/types/types';
import { UpdateCuttingDto } from './dtos/update-cutting.dto';
import { CUTTING_STATUS } from '@prisma/client';

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

    async getSingleCuttingItem(cuttingItemId: number): Promise<CustomResponse> {
        try {
            const singleRecordResponse = await this.prisma.getData('item_Cutting', 'findFirst', { where: { order_item_id: cuttingItemId }, include: { order_item: { include: { order: { select: { required_date: true } } } } } })

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

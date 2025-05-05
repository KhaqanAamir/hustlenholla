import { Injectable } from '@nestjs/common';
import { ORDER_ITEM_CURRENT_STAGE, PACKING_STATUS } from '@prisma/client';
import { PrismaService } from '../../prisma_service/prisma.service';
import { CustomResponse } from '../../types/types';
import { UpdatePackagingDto } from './dtos/update-packaging.dto';

@Injectable()
export class PackagingService {
    constructor(
        private readonly prisma: PrismaService
    ) { }

    async startPackaging(orderItemId: number): Promise<CustomResponse> {
        try {

            const [createPackagingResponse, updateOrderItemResponse] = await this.prisma.$transaction([
                this.prisma.item_Packaging.create({
                    data: {
                        order_item_id: orderItemId
                    }
                }),
                this.prisma.order_Item.update({
                    where: { id: orderItemId },
                    data: {
                        current_process: ORDER_ITEM_CURRENT_STAGE.PACKAGING
                    }
                })
            ]);

            return { error: false, msg: "Packaging stage started", data: createPackagingResponse };
        }
        catch (e) {
            return { error: true, msg: `Inernal server error occured, ${e}` }
        }
    }


    async getSinglePackagingItem(orderItemId: number): Promise<CustomResponse> {
        try {
            const singleRecordResponse = await this.prisma.getData('item_Packaging', 'findUnique', {
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

    async updatePackaging(packagingItemId: number, body: UpdatePackagingDto, now: Date): Promise<CustomResponse> {
        try {
            const updatePackagingResponse = await this.prisma.updateData('item_Packaging', 'update',
                {
                    where: { id: packagingItemId },
                    data: { ...body, status: PACKING_STATUS.COMPLETED, completed_at: now, }
                })

            return updatePackagingResponse
        }
        catch (e) {
            return { error: true, msg: `Inernal server error occured, ${e}` }
        }
    }
}

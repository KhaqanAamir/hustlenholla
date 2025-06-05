import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { CustomResponse } from 'src/types/types';
import { PrismaService } from '../prisma_service/prisma.service';
import { ORDER_ITEM_CURRENT_STAGE, ORDER_ITEM_STATUS, ORDER_STATUS, Prisma } from '@prisma/client';
import { UpdateOrderDto } from './dto/update-order.dto';
import { RequestedItemsDto } from './dto/requested-items.dto';

@Injectable()
export class OrdersService {

    constructor(
        private readonly prisma: PrismaService,
    ) { }

    async createOrder(createOrderDto: CreateOrderDto, requestedItems: RequestedItemsDto[], itemImages: string[]): Promise<CustomResponse> {
        try {
            const itemsWithImages = requestedItems.map((item, index) => ({
                ...item,
                current_process: ORDER_ITEM_CURRENT_STAGE.CUTTING,
                item_image: itemImages[index]
            })
            )
            const [orderCreatedResponse] = await this.prisma.$transaction([
                this.prisma.orders.create({
                    data: {
                        required_date: new Date(createOrderDto.required_date),
                        supplier_name: createOrderDto.supplier_name,
                        supplier_address: createOrderDto.supplier_address,
                        customer_email: createOrderDto.customer_email,
                        remarks: createOrderDto.remarks,
                        delivery_period: createOrderDto.delivery_period,
                        delivery_destination: createOrderDto.delivery_destination,
                        payment_terms: createOrderDto.payment_terms,
                        freight_terms: createOrderDto.freight_terms,
                        sales_tax: createOrderDto.sales_tax,
                        discount: createOrderDto.discount,
                        freight: createOrderDto.freight,
                        total_amount: createOrderDto.total_amount,
                        net_amount: createOrderDto.net_amount,
                        items: {
                            create: itemsWithImages,
                        },
                    },
                    include: {
                        items: true,
                    },
                }),
            ]);

            const cuttingCreates = orderCreatedResponse.items.map((item) =>
                this.prisma.item_Cutting.create({
                    data: {
                        order_item_id: item.id,
                    },
                })
            );

            await this.prisma.$transaction(cuttingCreates);

            return { error: false, msg: "Order created successfully", data: orderCreatedResponse }
        }
        catch (e) {
            return { error: true, msg: `Internal server error occured, ${e}` }
        }
    }

    // will be used if wanted to add order item manually,, as of now not needed
    async createRequestedItems(itemsWithOrderId: Prisma.Order_ItemCreateInput[]): Promise<CustomResponse> {
        try {
            const requestedItemsResponse = await this.prisma.postData('order_Item', 'createMany', itemsWithOrderId)

            if (requestedItemsResponse.error)
                return requestedItemsResponse

            return requestedItemsResponse
        }
        catch (e) {
            return { error: true, msg: `Inernal server error occured, ${e}` }
        }
    }

    async checkOrderCompletion({ where }): Promise<CustomResponse> {
        try {
            const orderCompletionResponse = await this.prisma.getData('orders', 'findMany', {
                where: where,
                select: {
                    id: true,
                    supplier_email: true
                }
            })
            if (orderCompletionResponse.error || !orderCompletionResponse.data)
                return orderCompletionResponse

            orderCompletionResponse.msg = 'Your order has been Completed Successfully'
            return orderCompletionResponse
        }
        catch (e) {
            return { error: true, msg: `Inernal server error occured, ${e}` }
        }
    }

    async markOrderItemAsCompleted(orderItemId: number): Promise<CustomResponse> {
        try {
            const markOrderItemAsCompletedResponse = await this.prisma.updateData('order_Item', 'update', {
                where: { id: orderItemId },
                data: {
                    status: ORDER_STATUS.COMPLETED
                }
            })

            if (markOrderItemAsCompletedResponse.error || !markOrderItemAsCompletedResponse.data)
                return markOrderItemAsCompletedResponse

            return markOrderItemAsCompletedResponse
        }
        catch (e) {
            return { error: true, msg: `Inernal server error occured, ${e}` }
        }
    }

    async updateOrder(orderId: number, body: UpdateOrderDto): Promise<CustomResponse> {
        try {
            const updateOrderResponse = await this.prisma.updateData('orders', 'update', {
                where: { id: orderId },
                data: body
            })

            if (updateOrderResponse.error || !updateOrderResponse.data)
                return updateOrderResponse

            return updateOrderResponse
        }
        catch (e) {
            return { error: true, msg: `Inernal server error occured, ${e}` }
        }
    }

    async getSingleOrder(orderId: number): Promise<CustomResponse> {
        try {
            const getSingleOrderResponse = await this.prisma.getData('orders', 'findUnique', {
                where: { id: orderId }
            })

            return getSingleOrderResponse
        }
        catch (e) {
            return { error: true, msg: `Inernal server error occured, ${e}` }
        }
    }

    async deleteOrder(orderId: number): Promise<CustomResponse> {
        try {
            const deleteOrderResponse = await this.prisma.deleteData('orders', 'delete', {
                where: { id: orderId }
            })

            return deleteOrderResponse
        }
        catch (e) {
            return { error: true, msg: `Internal server error occured, ${e}` }
        }
    }
}

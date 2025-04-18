import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { CustomResponse } from 'src/types/types';
import { PrismaService } from 'src/prisma_service/prisma.service';
import { ORDER_STATUS, Prisma } from '@prisma/client';

@Injectable()
export class OrdersService {

    constructor(
        private readonly prisma: PrismaService
    ) { }

    async createOrder(createOrderDto: CreateOrderDto): Promise<CustomResponse> {
        try {
            const { requested_items, ...orderData } = createOrderDto;
            const orderCreatedResponse = await this.prisma.orders.create({
                data: {
                    ...orderData,
                    items: {
                        create: [
                            ...requested_items
                        ]
                    }
                }
            })
            if (!orderCreatedResponse)
                return { error: true, msg: 'Unable to insert data in orders table', data: null }

            return { error: false, msg: 'Order Created Successfully', data: orderCreatedResponse }
        }
        catch (e) {
            return { error: true, msg: `Inernal server error occured, ${e}` }
        }
    }

    // will be used if wanted to add order item manually,, as of now not needed
    async createRequestedItems(itemsWithOrderId: Prisma.Order_ItemCreateInput[]): Promise<CustomResponse> {
        try {
            // const requestedItemsResponse = await this.supabaseService.postData('requested_items', itemsWithOrderId)
            const requestedItemsResponse = await this.prisma.postData('order_Item', 'createMany', itemsWithOrderId)

            if (requestedItemsResponse.error)
                return requestedItemsResponse

            return requestedItemsResponse
        }
        catch (e) {
            return { error: true, msg: `Inernal server error occured, ${e}` }
        }
    }

    async totalOrders(): Promise<CustomResponse> {
        try {
            const totalOrdersResponse = await this.prisma.getData('orders', 'findMany')
            if (totalOrdersResponse.error || !totalOrdersResponse.data)
                return totalOrdersResponse

            totalOrdersResponse.totalOrders = totalOrdersResponse.data.length
            delete totalOrdersResponse.data
            return totalOrdersResponse
        }
        catch (e) {
            return { error: true, msg: `Inernal server error occured, ${e}` }
        }
    }

    async pendingOrders(): Promise<CustomResponse> {
        try {
            const pendingOrdersResponse = await this.prisma.getData('orders', 'findMany', {
                where: {
                    status: ORDER_STATUS.PENDING
                }
            })
            if (pendingOrdersResponse.error || !pendingOrdersResponse.data)
                return pendingOrdersResponse

            pendingOrdersResponse.pendingOrders = pendingOrdersResponse.data.length
            delete pendingOrdersResponse.data
            return pendingOrdersResponse
        }
        catch (e) {
            return { error: true, msg: `Inernal server error occured, ${e}` }
        }
    }

    async completedOrders(): Promise<CustomResponse> {
        try {
            const completedOrdersResponse = await this.prisma.getData('orders', 'findMany', {
                where: {
                    status: ORDER_STATUS.COMPLETED
                }
            })
            if (completedOrdersResponse.error || !completedOrdersResponse.data)
                return completedOrdersResponse

            completedOrdersResponse.pendingOrders = completedOrdersResponse.data.length
            delete completedOrdersResponse.data
            return completedOrdersResponse
        }
        catch (e) {
            return { error: true, msg: `Inernal server error occured, ${e}` }
        }
    }

    async getAllOrders(
        { where, skip, take }
    ): Promise<CustomResponse> {
        try {
            const getAllOrdersResponse = await this.prisma.getData('order_Item', 'findMany', {
                skip,
                take,
                where: where,
                include: {
                    order: {
                        select: {
                            required_date: true
                        }
                    }
                }
            })
            if (getAllOrdersResponse.error || !getAllOrdersResponse.data)
                return getAllOrdersResponse

            getAllOrdersResponse.allOrders = getAllOrdersResponse.data.map((o) => ({
                id: o.id,
                item_description: o.item_description,
                item_code: o.item_code,
                current_process: o.current_process,
                required_date: o.order.required_date,
                status: o.status
            }))


            delete getAllOrdersResponse.data
            return getAllOrdersResponse
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
}

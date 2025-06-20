import { Injectable } from '@nestjs/common';
import { ORDER_ITEM_STATUS, ORDER_STATUS } from '@prisma/client';
import { PrismaService } from 'src/prisma_service/prisma.service';
import { CustomResponse } from 'src/types/types';

@Injectable()
export class WorkOrdersService {
    constructor(
        private readonly prisma: PrismaService
    ) { }

    async assignedWorkOrders(): Promise<CustomResponse> {
        try {
            const assignedWorkOrdersResponse = await this.prisma.getData('order_Item', 'findMany', {
                where: {
                    status: ORDER_ITEM_STATUS.PENDING
                }
            })
            if (assignedWorkOrdersResponse.error || !assignedWorkOrdersResponse.data)
                return assignedWorkOrdersResponse

            assignedWorkOrdersResponse.totalOrders = assignedWorkOrdersResponse.data.length
            delete assignedWorkOrdersResponse.data
            return assignedWorkOrdersResponse
        }
        catch (e) {
            return { error: true, msg: `Inernal server error occured, ${e}` }
        }
    }

    async pendingWorkOrders(): Promise<CustomResponse> {
        try {
            const currentDate = new Date();
            const pendingOrdersResponse = await this.prisma.getData('order_Item', 'findMany', {
                where: {
                    order: {
                        required_date: {
                            lt: currentDate
                        }
                    },
                    status: ORDER_ITEM_STATUS.PENDING
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

    async completedWorkOrders(): Promise<CustomResponse> {
        try {
            const completedOrdersResponse = await this.prisma.getData('order_Item', 'findMany', {
                where: {
                    status: ORDER_ITEM_STATUS.COMPLETED
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

    async getAllWorkOrders(
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

            const totalCountResponse = await this.prisma.order_Item.count()
            if (getAllOrdersResponse.error || !getAllOrdersResponse.data)
                return getAllOrdersResponse

            getAllOrdersResponse.data = getAllOrdersResponse.data.map((o: any) => ({
                id: o.id,
                item_description: o.item_description,
                item_code: o.item_code,
                current_process: o.current_process,
                required_date: o.order.required_date,
                status: o.status
            }))

            getAllOrdersResponse.count = totalCountResponse
            return getAllOrdersResponse
        }
        catch (e) {
            return { error: true, msg: `Inernal server error occured, ${e}` }
        }
    }

    async getWorkOrderDetails(orderId: number): Promise<CustomResponse> {
        try {
            const allStages = [];
            const getOrderResponse = await this.prisma.getData('order_Item', 'findUnique', {
                where: { id: orderId },
                include: {
                    cutting: true,
                    stitching: true,
                    washing: true,
                    finishing: true,
                    quality_control: true,
                    packaging: true,
                    dispatched: true
                }
            })

            if (getOrderResponse.error || !getOrderResponse.data)
                return getOrderResponse

            const stageMap = {
                cutting: getOrderResponse.data.cutting,
                stitching: getOrderResponse.data.stitching,
                washing: getOrderResponse.data.washing,
                finishing: getOrderResponse.data.finishing,
                quality_control: getOrderResponse.data.quality_control,
                packaging: getOrderResponse.data.packaging,
                dispatched: getOrderResponse.data.dispatched,
            }

            for (const [stageName, stageEnteries] of Object.entries(stageMap)) {
                for (const entry of stageEnteries) {
                    allStages.push({
                        stage: stageName,
                        start_date: entry.start_date,
                        completed_at: entry.completed_at
                    })
                }
                if (stageEnteries.length === 0) {
                    allStages.push({
                        stage: stageName,
                        start_date: null,
                        completed_at: null
                    })
                }
            }

            const sortedStages = allStages.sort((a, b) => {
                const dateA = a.start_date ? new Date(a.start_date).getTime() : 0
                const dateB = b.start_date ? new Date(b.start_date).getTime() : 0
                return dateA - dateB
            })

            delete getOrderResponse.data.cutting
            delete getOrderResponse.data.stitching
            delete getOrderResponse.data.washing
            delete getOrderResponse.data.finishing
            delete getOrderResponse.data.quality_control
            delete getOrderResponse.data.packaging
            delete getOrderResponse.data.dispatched

            getOrderResponse.data.time_line = sortedStages

            return getOrderResponse
        }
        catch (e) {
            return { error: true, msg: `Inernal server error occured, ${e}` }
        }
    }

    async getWorkOrderStats({ where, skip, take, current_process }): Promise<CustomResponse> {
        try {
            const currentDate = new Date()
            const filterForAssignedOrders: any = {
                status: ORDER_ITEM_STATUS.PENDING
            }
            const filterForPndingOrders: any = {
                order: {
                    required_date: {
                        lt: currentDate
                    }
                },
                status: ORDER_ITEM_STATUS.PENDING
            }
            const filterForCompletedOrders: any = {
                status: ORDER_ITEM_STATUS.COMPLETED
            }
            if (current_process) {
                filterForAssignedOrders.current_process = current_process
                filterForPndingOrders.current_process = current_process
                filterForCompletedOrders.current_process = current_process
            }
            const assignedWorkOrders = await this.prisma.order_Item.count({
                where: filterForAssignedOrders
            });

            const pendingWorkOrders = await this.prisma.order_Item.count({
                where: filterForPndingOrders
            });

            const completedWorkOrders = await this.prisma.order_Item.count({
                where: filterForCompletedOrders
            });

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

            if (getAllOrdersResponse.data) {
                getAllOrdersResponse.data = getAllOrdersResponse.data.map((o: any) => ({
                    id: o.id,
                    item_description: o.item_description,
                    item_code: o.item_code,
                    current_process: o.current_process,
                    required_date: o.order.required_date,
                    status: o.status
                }))
            }

            return {
                error: false,
                data: {
                    assigned_orders: assignedWorkOrders,
                    pending_orders: pendingWorkOrders,
                    completed_orders: completedWorkOrders,
                    orders: getAllOrdersResponse.data
                },
                msg: 'Stats fetched successfully'
            }
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

    async deleteOrder(orderId: number): Promise<CustomResponse> {
        try {
            const deleteOrderResposne = await this.prisma.deleteData('order_Item', 'delete', {
                where: { id: orderId }
            })

            return deleteOrderResposne
        }
        catch (e) {
            return { error: true, msg: `Inernal server error occured, ${e}` }
        }
    }
}


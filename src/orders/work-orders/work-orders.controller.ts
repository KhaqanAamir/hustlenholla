import { Controller, Delete, Get, Param, ParseIntPipe, Put, Query } from '@nestjs/common';
import { WorkOrdersService } from './work-orders.service';
import { GetAllOrdersDto } from '../dto/get-all-orders.dto';

@Controller('work-orders')
export class WorkOrdersController {
    constructor(
        private readonly workOrderService: WorkOrdersService
    ) { }

    @Get('/assigned-work-orders')
    async assignedWorkOrders() {
        return await this.workOrderService.assignedWorkOrders()
    }

    @Get('/pending-work-orders')
    async pendingWorkOrders() {
        return await this.workOrderService.pendingWorkOrders()
    }

    @Get('/completed-work-orders')
    async completedWorkOrders() {
        return await this.workOrderService.completedWorkOrders()
    }

    @Get('/get-all-work-orders')
    async getAllWorkOrders(
        @Query() query: GetAllOrdersDto
    ) {
        const where = query ? {
            item_description: {
                contains: query.query || '',
                mode: 'insensitive'
            },
            current_process: query.process
        } : {}

        const skip = query.page_no && query.page_size ? (+query.page_no - 1) * +query.page_size : 0
        const take = query.page_size ? +query.page_size : 10

        return await this.workOrderService.getAllWorkOrders({ where, skip, take })
    }

    // the tracking of single order will be used only with start-date not with
    // completed-date,, if needed will add that as well
    @Get('/get-single-work-order/:order_Id')
    async getWorkOrderDetails(
        @Param('order_Id') orderId: string
    ) {
        return await this.workOrderService.getWorkOrderDetails(+orderId)
    }

    @Get('/work-order-stats')
    async getWorkOrderStats(
        @Query() query: GetAllOrdersDto
    ) {
        const where = query ? {
            item_description: {
                contains: query.query || '',
                mode: 'insensitive'
            },
            current_process: query.process
        } : {}

        const current_process = query.process ? query.process : null

        const skip = query.page_no && query.page_size ? (+query.page_no - 1) * +query.page_size : 0
        const take = query.page_size ? +query.page_size : 10
        return await this.workOrderService.getWorkOrderStats({ where, skip, take, current_process })
    }

    @Put('order-item-id/:id/mark-as-completed')
    async markOrderItemAsCompleted(
        @Param('id') orderItemId: string
    ) {
        return await this.workOrderService.markOrderItemAsCompleted(+orderItemId)
    }

    @Delete('/delete-work-order/:order_id')
    async deleteOrder(
        @Param('order_id', ParseIntPipe) orderId: number
    ) {
        return await this.workOrderService.deleteOrder(orderId)
    }
}

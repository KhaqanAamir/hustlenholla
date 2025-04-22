import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { CustomResponse } from 'src/types/types';
import { UserGuard } from 'src/auth/guards/auth.guard';
import { ORDER_STATUS, Prisma, USER_ROLE } from '@prisma/client';
import { GetAllOrdersDto } from './dto/get-all-orders.dto';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { RoleGuard } from 'src/auth/guards/role.guard';
// import { DummyGuard } from 'src/auth/guards/dummy.guard';

@Controller('orders')
export class OrdersController {

    constructor(private readonly ordersService: OrdersService) { }

    // splitting functions of order and requested items for reusability and testability,
    // also a modular approach to better debug and scale if we have to do in future
    @Post('/')
    async createOrder(
        @Body() createOrderDto: CreateOrderDto
    ): Promise<CustomResponse> {

        let total_amount: number = 0;

        createOrderDto.requested_items.forEach(item => {
            item.amount = this.calculateItemAmount(item.quantity, item.rate)
            total_amount += (item as any).amount
        })

        let net_amount: number = total_amount;

        if (createOrderDto.sales_tax > 0)
            net_amount += this.addSalesTax(createOrderDto.sales_tax, total_amount)

        if (createOrderDto.discount > 0)
            net_amount += this.addDiscount(createOrderDto.discount, total_amount)

        if (createOrderDto.freight)
            net_amount + createOrderDto.freight

        createOrderDto.total_amount = total_amount
        createOrderDto.net_amount = net_amount

        return await this.ordersService.createOrder(createOrderDto)

    }

    // the below function will upload record on requested_items table
    createRequestedItems(requestedItems: Prisma.Order_ItemCreateInput[]): Promise<CustomResponse> {
        return this.ordersService.createRequestedItems(requestedItems)
    }

    // the function will calculate total amount of the an individual item,, the reason to separate the function is to 
    // do complex calculation for e.g when price is different of item depending on different variants,, for now it is 
    // simple multiplication of rate and quantity
    calculateItemAmount(quantity: number, rate: number): number {
        return rate * quantity
    }

    // this will calculate the salex tax and add the value in total amount variable used in create order fn
    addSalesTax(percentage: number, total_amount: number): number {
        return (percentage / 100) * total_amount
    }

    // this will calculate the discount and subtract the value in total amount variable used in create order fn
    addDiscount(percentage: number, total_amount: number): number {
        const discounted_price = (percentage / 100) * total_amount;
        return total_amount - discounted_price
    }

    @Roles(USER_ROLE.SUPER_ADMIN)
    @UseGuards(UserGuard, RoleGuard)
    @Get('/testing')
    async test(
        @Req() req
    ) {
        return 'hello'
    }

    @Get('/assigned-orders')
    async totalOrders() {
        return await this.ordersService.totalOrders()
    }

    @Get('/pending-orders')
    async pendingOrders() {
        return await this.ordersService.pendingOrders()
    }

    @Get('/completed-orders')
    async completedOrders() {
        return await this.ordersService.completedOrders()
    }

    @Get('/get-all-orders')
    async getAllOrders(
        @Query() query: GetAllOrdersDto
    ) {
        const where = query.query ? {
            item_description: {
                contains: query.query || '',
                mode: 'insensitive'
            },
            current_process: query.process
        }
            : {}
        const skip = query.page_no && query.page_size ? (+query.page_no - 1) * +query.page_size : 0
        const take = query.page_size ? +query.page_size : 10

        return await this.ordersService.getAllOrders({ where, skip, take })
    }

    @Get('/get-single-order/:order_Id')
    async getOrderDetails(
        @Param('order_Id') orderId: string
    ) {
        return await this.ordersService.getOrderDetails(+orderId)
    }

    @Get('/completed/today')
    async checkOrderCompletion(
    ) {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999)

        const where = {
            completed_at: {
                gte: startOfDay,
                lte: endOfDay
            },
            status: ORDER_STATUS.COMPLETED
        }
        return await this.ordersService.checkOrderCompletion({ where })
    }
}

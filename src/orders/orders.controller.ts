import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { RequestedItemsDto } from './dto/requested-items.dto';
import { CustomResponse } from 'src/types/types';
import { UserGuard } from 'src/auth/guards/auth.guard';
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
        const { requested_items, ...orderData } = createOrderDto;

        let total_amount: number = 0;

        requested_items.forEach(item => {
            item.amount = this.calculateItemAmount(item.quantity, item.rate)
            total_amount += (item as any).amount
        })

        let net_amount: number = total_amount;

        if (orderData.sales_tax > 0)
            net_amount += this.addSalesTax(orderData.sales_tax, total_amount)

        if (orderData.discount > 0)
            net_amount += this.addDiscount(orderData.discount, total_amount)

        if (orderData.freight)
            net_amount + orderData.freight

        createOrderDto.total_amount = total_amount
        createOrderDto.net_amount = net_amount

        const orderCreatedResponse = await this.ordersService.createOrder(createOrderDto)

        const itemsWithOrderId: RequestedItemsDto[] = requested_items.map((item) => ({
            ...item,
            order_id: Number(orderCreatedResponse.data[0].id)
        }))

        const requestedItemsResponse = await this.createRequestedItems(itemsWithOrderId)
        if (requestedItemsResponse.error)
            return requestedItemsResponse

        return {
            error: false,
            msg: 'Order Created Successfully'
        }

    }

    // the below function will upload record on requested_items table
    createRequestedItems(requestedItems: RequestedItemsDto[]): Promise<CustomResponse> {
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

    @UseGuards(UserGuard)
    @Get('/testing')
    async test() {
        return 'hello'
    }
}

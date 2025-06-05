import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { CustomResponse } from 'src/types/types';
import { ORDER_STATUS, Prisma } from '@prisma/client';
import { GetAllOrdersDto } from './dto/get-all-orders.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join, extname } from 'path';
import { v4 as uuidv4 } from 'uuid'
import { RequestedItemsDto } from './dto/requested-items.dto';
import { ParseJsonPipe } from 'src/utility/form-data-validation/parse-json-pipe';

@Controller('orders')
export class OrdersController {

    constructor(private readonly ordersService: OrdersService) { }

    // splitting functions of order and requested items for reusability and testability,
    // also a modular approach to better debug and scale if we have to do in future
    @Post('/')
    @UseInterceptors(
        FilesInterceptor('item_images', 10, {
            storage: diskStorage({
                destination: join(__dirname, '..', '..', 'uploads'),
                filename: (req, file, callback) => {
                    const uniqueSuffix = `${uuidv4()}${extname(file.originalname)}`
                    callback(null, uniqueSuffix)
                }
            }),
            fileFilter: (req, file, callback) => {
                if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
                    return callback(new Error('Only image files are allowed!'), false)
                }
                callback(null, true)
            },
            limits: { fileSize: 5 * 1024 * 1024 } // 5 MB
        })
    )
    async createOrder(
        @UploadedFiles() itemImages: Express.Multer.File[],
        @Body('requested_items', ParseJsonPipe) requestedItems: RequestedItemsDto[],
        @Body() createOrderDto: CreateOrderDto
    ) {

        if (itemImages.length != requestedItems.length)
            throw new Error('Make sure to upload images for all requested items')

        const images = itemImages.map(file => `/uploads/${file.filename}`);
        let total_amount: number = 0;

        if (typeof createOrderDto.delivery_period === 'string') {
            createOrderDto.delivery_period = parseInt(createOrderDto.delivery_period, 10);
        }
        if (typeof createOrderDto.sales_tax === 'string') {
            createOrderDto.sales_tax = parseInt(createOrderDto.sales_tax, 10);
        }
        if (typeof createOrderDto.discount === 'string') {
            createOrderDto.discount = parseInt(createOrderDto.discount, 10);
        }
        if (typeof createOrderDto.freight === 'string') {
            createOrderDto.freight = parseInt(createOrderDto.freight, 10);
        }

        requestedItems.forEach(item => {
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

        return await this.ordersService.createOrder(createOrderDto, requestedItems, images)
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

    // endpoint needed by Alan for AI module
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

    @Put('/:order_id')
    async updateOrder(
        @Param('order_id', ParseIntPipe) orderId: number,
        @Body() body: UpdateOrderDto
    ) {
        return await this.ordersService.updateOrder(orderId, body)
    }

    @Get('/:order_id')
    async getSingleOrder(
        @Param('order_id', ParseIntPipe) orderId: number
    ) {
        return await this.ordersService.getSingleOrder(orderId)
    }

    @Delete('/:order_id')
    async deleteOrder(
        @Param('order_id', ParseIntPipe) orderId: number
    ) {
        return await this.ordersService.deleteOrder(orderId)
    }
}

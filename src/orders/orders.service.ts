import { Injectable } from '@nestjs/common';
import { SupabaseService } from 'src/supabase/supabase.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { CustomResponse } from 'src/types/types';
import { RequestedItemsDto } from './dto/requested-items.dto';

@Injectable()
export class OrdersService {

    constructor(private readonly supabaseService: SupabaseService) { }

    async createOrder(createOrderDto: CreateOrderDto): Promise<CustomResponse> {
        try {
            let { requested_items, ...orderData } = createOrderDto
            const orderCreatedResponse = await this.supabaseService.postData('orders', orderData)
            if (orderCreatedResponse.error)
                return orderCreatedResponse

            return orderCreatedResponse
        }
        catch (e) {
            return { error: true, msg: `Inernal server error occured, ${e}` }
        }
    }

    async createRequestedItems(itemsWithOrderId: RequestedItemsDto[]): Promise<CustomResponse> {
        try {
            const requestedItemsResponse = await this.supabaseService.postData('requested_items', itemsWithOrderId)

            if (requestedItemsResponse.error)
                return requestedItemsResponse

            return requestedItemsResponse
        }
        catch (e) {
            return { error: true, msg: `Inernal server error occured, ${e}` }
        }
    }
}

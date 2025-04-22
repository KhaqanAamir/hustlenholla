import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { WashingService } from './washing.service';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { USER_ROLE } from '@prisma/client';
import { UserGuard } from 'src/auth/guards/auth.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { UpdateWashingDto } from './dtos/update-washing.dto';

@Controller('washing')
export class WashingController {

    constructor(
        private readonly washingService: WashingService
    ) { }


    @Roles(USER_ROLE.SUPER_ADMIN)
    @UseGuards(UserGuard, RoleGuard)
    @Post('/order-item-id/:id/start')
    async startWashing(
        @Param('id') orderItemId: string
    ) {
        return await this.washingService.startWashing(+orderItemId)
    }

    @Roles(USER_ROLE.SUPER_ADMIN)
    @UseGuards(UserGuard, RoleGuard)
    @Get('/order-item-id/:id')
    async getSingleWashingItem(
        @Param('id') orderItemId: string
    ) {
        return await this.washingService.getSingleWashingItem(+orderItemId)
    }

    @Roles(USER_ROLE.SUPER_ADMIN)
    @UseGuards(UserGuard, RoleGuard)
    @Put('/washing-item-id/:id/update')
    async updateWashing(
        @Param('id') washingItemId: string,
        @Body() body: UpdateWashingDto
    ) {
        const now = new Date()
        const total_quantity = body.operations.reduce((acc, op) => acc + op.quantity, 0)
        return await this.washingService.updateWashing(+washingItemId, body, total_quantity, now)
    }
}

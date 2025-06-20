import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { DispatchService } from './dispatch.service';
import { Roles } from '../../auth/decorator/roles.decorator';
import { USER_ROLE } from '@prisma/client';
import { UserGuard } from '../../auth/guards/auth.guard';
import { RoleGuard } from '../../auth/guards/role.guard';
import { UpdateDispatchingDto } from './dtos/update-dispatching.dto';

@Controller('dispatch')
export class DispatchController {
    constructor(
        private readonly dispatchService: DispatchService
    ) { }

    @Roles(USER_ROLE.SUPER_ADMIN)
    @UseGuards(UserGuard, RoleGuard)
    @Post('/order-item-id/:id/start')
    async startDispatching(
        @Param('id', ParseIntPipe) orderItemId: string
    ) {
        return await this.dispatchService.startDispatching(+orderItemId)
    }

    @Roles(USER_ROLE.SUPER_ADMIN)
    @UseGuards(UserGuard, RoleGuard)
    @Get('/order-item-id/:id')
    async getSingleDispatchingItem(
        @Param('id') orderItemId: string
    ) {
        return await this.dispatchService.getSingleDispatchingItem(+orderItemId)
    }

    @Roles(USER_ROLE.SUPER_ADMIN)
    @UseGuards(UserGuard, RoleGuard)
    @Put('/dispatching-item-id/:id/update')
    async updateDispatching(
        @Param('id') dispatchingItemId: string,
        @Body() body: UpdateDispatchingDto
    ) {
        const now = new Date();
        return await this.dispatchService.updateDispatching(+dispatchingItemId, body, now)
    }
}
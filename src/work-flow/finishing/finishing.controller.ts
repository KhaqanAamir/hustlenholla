import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { FinishingService } from './finishing.service';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { USER_ROLE } from '@prisma/client';
import { UserGuard } from 'src/auth/guards/auth.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { UpdateFinishingDto } from './dtos/update-finishing.dto';

@Controller('finishing')
export class FinishingController {
    constructor(
        private readonly finishingService: FinishingService
    ) { }

    @Roles(USER_ROLE.SUPER_ADMIN)
    @UseGuards(UserGuard, RoleGuard)
    @Post('/order-item-id/:id/start')
    async startFinishing(
        @Param('id') orderItemId: string
    ) {
        return await this.finishingService.startFinishing(+orderItemId)
    }

    @Roles(USER_ROLE.SUPER_ADMIN)
    @UseGuards(UserGuard, RoleGuard)
    @Get('/order-item-id/:id')
    async getSingleFinishingItem(
        @Param('id') orderItemId: string
    ) {
        return await this.finishingService.getSingleFinishingItem(+orderItemId)
    }


    @Roles(USER_ROLE.SUPER_ADMIN)
    @UseGuards(UserGuard, RoleGuard)
    @Put('/finishing-item-id/:id/update')
    async updateFinishing(
        @Param('id') finishingItemId: string,
        @Body() body: UpdateFinishingDto
    ) {
        const now = new Date()
        const total_quantity = body.operations.reduce((acc, op) => acc + op.quantity, 0)
        return await this.finishingService.updateFinishing(+finishingItemId, body, total_quantity, now)
    }
}

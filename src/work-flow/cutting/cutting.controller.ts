import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { CuttingService } from './cutting.service';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { USER_ROLE } from '@prisma/client';
import { UserGuard } from 'src/auth/guards/auth.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { UpdateCuttingDto } from './dtos/update-cutting.dto';

@Controller('/cutting')
export class CuttingController {

    constructor(
        private readonly cuttingService: CuttingService
    ) { }

    @Roles(USER_ROLE.SUPER_ADMIN)
    @UseGuards(UserGuard, RoleGuard)
    @Post('/order-item-id/:id/start')
    async startCutting(
        @Param('id') orderItemId: string
    ) {
        return await this.cuttingService.startCutting(+orderItemId)
    }

    @Roles(USER_ROLE.SUPER_ADMIN)
    @UseGuards(UserGuard, RoleGuard)
    @Get('/cutting-item-id/:id')
    async getSingleCuttingItem(
        @Param('id') cuttingItemId: string
    ) {
        return await this.cuttingService.getSingleCuttingItem(+cuttingItemId)
    }


    @Roles(USER_ROLE.SUPER_ADMIN)
    @UseGuards(UserGuard, RoleGuard)
    @Put('/cutting-item-id/:id/update')
    async updateCutting(
        @Param('id') cuttingItemId: string,
        @Body() body: UpdateCuttingDto
    ) {
        const now = new Date()
        const total_quantity = body.operations.reduce((acc, op) => acc + op.quantity, 0)
        return await this.cuttingService.updateCutting(+cuttingItemId, body, total_quantity, now)
    }
}

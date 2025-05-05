import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { StitchingService } from './stitching.service';
import { USER_ROLE } from '@prisma/client';
import { Roles } from '../../auth/decorator/roles.decorator';
import { UserGuard } from '../../auth/guards/auth.guard';
import { RoleGuard } from '../../auth/guards/role.guard';
import { UpdateStitchingDto } from './dtos/update-stitching.dto';

@Controller('stitching')
export class StitchingController {

    constructor(
        private readonly stitchingService: StitchingService
    ) { }


    @Roles(USER_ROLE.SUPER_ADMIN)
    @UseGuards(UserGuard, RoleGuard)
    @Post('/order-item-id/:id/start')
    async startStitching(
        @Param('id') orderItemId: string
    ) {
        return await this.stitchingService.startStitching(+orderItemId)
    }

    @Roles(USER_ROLE.SUPER_ADMIN)
    @UseGuards(UserGuard, RoleGuard)
    @Get('/order-item-id/:id')
    async getSingleStitchingItem(
        @Param('id') orderItemId: string
    ) {
        return await this.stitchingService.getSingleStitchingItem(+orderItemId)
    }

    @Roles(USER_ROLE.SUPER_ADMIN)
    @UseGuards(UserGuard, RoleGuard)
    @Put('/stitching-item-id/:id/update')
    async updateStitching(
        @Param('id') stitchingItemId: string,
        @Body() body: UpdateStitchingDto
    ) {
        const now = new Date()
        const total_quantity = body.operations.reduce((acc, op) => acc + op.quantity, 0)
        return await this.stitchingService.updateStitching(+stitchingItemId, body, total_quantity, now)
    }
}

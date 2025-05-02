import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { PackagingService } from './packaging.service';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { USER_ROLE } from '@prisma/client';
import { UserGuard } from 'src/auth/guards/auth.guard';
import { RoleGuard } from 'src/auth/guards/role.guard';
import { UpdatePackagingDto } from './dtos/update-packaging.dto';

@Controller('packaging')
export class PackagingController {
    constructor(
        private readonly packagingService: PackagingService
    ) { }

    @Roles(USER_ROLE.SUPER_ADMIN)
    @UseGuards(UserGuard, RoleGuard)
    @Post('/order-item-id/:id/start')
    async startPackaging(
        @Param('id') orderItemId: string
    ) {
        return await this.packagingService.startPackaging(+orderItemId)
    }

    @Roles(USER_ROLE.SUPER_ADMIN)
    @UseGuards(UserGuard, RoleGuard)
    @Get('/order-item-id/:id')
    async getSinglePackagingItem(
        @Param('id') orderItemId: string
    ) {
        return await this.packagingService.getSinglePackagingItem(+orderItemId)
    }

    @Roles(USER_ROLE.SUPER_ADMIN)
    @UseGuards(UserGuard, RoleGuard)
    @Put('/packaging-item-id/:id/update')
    async updateFinishing(
        @Param('id') packagingItemId: string,
        @Body() body: UpdatePackagingDto
    ) {
        const now = new Date()
        for (let i of body.operations) {
            i.total_sku_per_ctn = i.quantity_size_wise.reduce((acc, size) => acc + size.quantity, 0)
            i.number_of_ctn = i.quantity_size_wise.length
        }
        return await this.packagingService.updatePackaging(+packagingItemId, body, now)
    }
}

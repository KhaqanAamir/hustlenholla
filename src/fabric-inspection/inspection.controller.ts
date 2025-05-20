import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { FabricInspectionService } from './inspection.service';
import { FabricRequestDto } from './dtos/create-fabric-request.dto';
import { UpdateFabricRequestDto } from './dtos/update-fabric-request.dto';

@Controller('fabric-inspection')
export class FabricInspectionController {
    constructor(
        private readonly fabricInspectionService: FabricInspectionService
    ) { }

    @Post('/generate-fabric-request-for-store')
    async generateFabricRequestForStore(
        @Body() body: FabricRequestDto
    ) {
        return await this.fabricInspectionService.generateFabricRequestForStore(body)
    }

    @Get('/fabric-request/:request_id')
    async getFabricRequest(
        @Param('request_id', ParseIntPipe) requestId: number
    ) {
        return await this.fabricInspectionService.getFabricRequest(requestId)
    }

    @Put('fabric-request/:request_id')
    async updateFabricRequest(
        @Param('request_id', ParseIntPipe) requestId: number,
        @Body() body: UpdateFabricRequestDto
    ) {
        return await this.fabricInspectionService.updateFabricRequest(requestId, body)
    }

    @Delete('fabric-request/:request_id')
    async deleteFabricRequest(
        @Param('request_id', ParseIntPipe) requestId: number
    ) {
        return await this.fabricInspectionService.deleteFabricRequest(requestId)
    }
}

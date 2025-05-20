import { Injectable } from '@nestjs/common';
import { FabricRequestDto } from './dtos/create-fabric-request.dto';
import { PrismaService } from 'src/prisma_service/prisma.service';
import { CustomResponse } from 'src/types/types';
import { UpdateFabricRequestDto } from './dtos/update-fabric-request.dto';

@Injectable()
export class FabricInspectionService {
    constructor(
        private readonly prismaService: PrismaService
    ) { }

    async generateFabricRequestForStore(body: FabricRequestDto): Promise<CustomResponse> {
        try {
            const createRequestResponse = await this.prismaService.postData('fabric_Request', 'create', body)
            return createRequestResponse
        }
        catch (e) {
            return { error: true, msg: `Inernal server error occured, ${e}` }
        }
    }

    async getFabricRequest(requestId: number): Promise<CustomResponse> {
        try {
            const getRequestResponse = await this.prismaService.getData('fabric_Request', 'findUnique',
                {
                    where:
                        { id: requestId }
                })

            return getRequestResponse
        }
        catch (e) {
            return { error: true, msg: `Inernal server error occured, ${e}` }
        }
    }

    async updateFabricRequest(requestId: number, body: UpdateFabricRequestDto): Promise<CustomResponse> {
        try {
            const updateRequestResponse = await this.prismaService.updateData('fabric_Request', 'update', {
                where: { id: requestId },
                data: body
            })

            return updateRequestResponse
        }
        catch (e) {
            return { error: true, msg: `Inernal server error occured, ${e}` }
        }
    }

    async deleteFabricRequest(requestId: number): Promise<CustomResponse> {
        try {
            const deleteRequestResponse = await this.prismaService.deleteData('fabric_Request', 'delete', { where: { id: requestId } })
            return deleteRequestResponse
        }
        catch (e) {
            return { error: true, msg: `Inernal server error occured, ${e}` }
        }
    }
}

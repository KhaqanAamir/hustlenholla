import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class ParseJsonPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        if (metadata.type === 'body' && typeof value === 'string') {
            try {
                return JSON.parse(value);
            }
            catch (e) {
                throw new BadRequestException(`Invalid JSON format for ${metadata.data}`);
            }
        }
        return value
    }
}
import { Injectable } from '@nestjs/common';
import { UniqueCodeDto } from 'src/dbservices/entities/uniqueCode.entity';
import { UniqueCodeQueries } from './uniqueCode.queries';
@Injectable()
export class UniqueCodeService {
    constructor(private uniqueCodeQueries: UniqueCodeQueries) {}

    async getUniqueCodes(options: UniqueCodeDto, projections: string[]): Promise<UniqueCodeDto[]> {
        return this.uniqueCodeQueries.getUniqueCodes(options, projections)
    }

    async insert(options: UniqueCodeDto[]): Promise<any>{
        return this.uniqueCodeQueries.insert(options)
    }

    async getNextAvailableUniqueCode(): Promise<UniqueCodeDto[]>{
        return this.uniqueCodeQueries.getNextAvailableUniqueCode()
    }

    async updateUniqueCode(param: UniqueCodeDto): Promise<any>{
        return this.uniqueCodeQueries.updateUniqueCodeStatus(param)
    }

}

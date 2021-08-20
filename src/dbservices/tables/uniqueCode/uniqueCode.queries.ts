import { Inject, Injectable } from '@nestjs/common';
import { KNEX_CONNECTION } from '@nestjsplus/knex';
import { UniqueCodeDto } from 'src/dbservices/entities/uniqueCode.entity';
import { tableNames } from 'src/shared/constants/dbtables';
@Injectable()
export class UniqueCodeQueries {
    constructor(@Inject(KNEX_CONNECTION) private readonly knex) {}

    async getUniqueCodes(options: UniqueCodeDto, projections: string[]): Promise<UniqueCodeDto[]> {
        let selectParam = ['*']
        if(projections && projections.length){
            selectParam = projections
        }
        const query = this.knex(tableNames.UNIQUE_CODE).select([...selectParam]);
        if(options){
            const {uniqueCode} = options
            if(uniqueCode){
                query.where(`uniqueCode`,uniqueCode)
            }
        }
        return query
    }

    async getNextAvailableUniqueCode():Promise<any>{
        const query = this.knex(tableNames.UNIQUE_CODE)
        query.where(`isActive`,true).orderBy('created_at', 'desc').limit(1)
        return query   
    }

    async updateUniqueCodeStatus(code: UniqueCodeDto):Promise<any>{
        const query = this.knex(tableNames.UNIQUE_CODE)
        
        query.where(`uniqueCode`,code.uniqueCode)
        query.update(`isActive`,code.isActive)

        return query   
    }

    async insert(options: UniqueCodeDto[]):Promise<any>{
        const query = this.knex(tableNames.UNIQUE_CODE)
        if(options && Array.isArray(options)){
            query.insert(options)
        }
        return query     
    }

}

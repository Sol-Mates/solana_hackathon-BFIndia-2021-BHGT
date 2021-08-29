import { Inject, Injectable } from '@nestjs/common';
import { KNEX_CONNECTION } from '@nestjsplus/knex';
import { CurrencyStakeInfoDto, CoupleInfoDto } from 'src/dbservices/entities/couple.entity';
import { tableNames } from 'src/shared/constants/dbtables';
import { ICertificateInfoDto, ICoupleCurrencyInfo } from 'src/user/user.dto';
@Injectable()
export class CoupleQueries {
    constructor(@Inject(KNEX_CONNECTION) private readonly knex) {}

    async doesCodeAlreadyExistForFirstPartner(couple: CoupleInfoDto):Promise<CoupleInfoDto[]>{
        const query = this.knex(tableNames.COUPLE_INFO)
        if(couple.first_partner){
            query.where(`first_partner`,couple.first_partner)
        }

        if(couple.coupleId){
            query.where(`coupleId`,couple.coupleId)
        }

        if(couple.second_partner){
            query.where(`second_partner`,couple.second_partner)
        }else{
                query.whereNull('second_partner')
        }

        return query   
    }

    async addCodeForFirstPartner(couple: CoupleInfoDto):Promise<any>{
        const query = this.knex(tableNames.COUPLE_INFO)

        query.insert([{coupleId:couple.coupleId, first_partner: couple.first_partner}])

        return query   
    }

    async joinInvite(couple: CoupleInfoDto):Promise<any>{
        const query = this.knex(tableNames.COUPLE_INFO)
        
        query.where(`coupleId`,couple.coupleId)
        query.update({second_partner: couple.second_partner, isActive: true})
        return query     
    }

    // async insert(options: UniqueCodeDto[]):Promise<any>{
    //     const query = this.knex(tableNames.UNIQUE_CODE)
    //     if(options && Array.isArray(options)){
    //         query.insert(options)
    //     }
    //     return query     
    // }

    async addCertificateInfo(info: ICertificateInfoDto): Promise<any>{
        const query = this.knex(tableNames.CERTIFICATE_INFO)

        return query.insert(info)
    }

    async addCoupleCurrencyInfo(options: ICoupleCurrencyInfo[]): Promise<any>{
        const query = this.knex(tableNames.COUPLE_CURRENCY_INFO)
        // `INSERT INTO ${tableNames.COUPLE_CURRENCY_INFO} (\`coupleId\`, \`currency_share_percentage\`, \`currency_stake_count\`,\`currency_wallet_address\`) 
        //         VALUES('${options.coupleId}', '${options.currency_share_percentage}', '${options.currency_stake_count}','${options.currency_wallet_address}')
        //         ON DUPLICATE KEY UPDATE
        //         keyData = '${insertObj.keyData}'`
        if(options && Array.isArray(options)){
            query.insert(options)
        }
        return query
    }
    async addCoupleExtendedInfo(info: CurrencyStakeInfoDto): Promise<any>{
        const query = this.knex(tableNames.COUPLE_INFO)
        
        query.where(`coupleId`,info.coupleId)
        query.update({...info})
        return query  
    }

    async disableCoupleCurrencyInfo(coupleId: string): Promise<any>{
        const query = this.knex(tableNames.COUPLE_CURRENCY_INFO)
        
        query.where(`coupleId`,coupleId)
        query.update('isLatest', false)
        return query   
    }

    async fetchUsersFromCoupleInfo(couple: CoupleInfoDto): Promise<CoupleInfoDto[]>{
        const query = this.knex(tableNames.COUPLE_INFO)
        if(couple.first_partner){
            query.where(`first_partner`,couple.first_partner)
        }

        if(couple.coupleId){
            query.where(`coupleId`,couple.coupleId)
        }

        if(couple.second_partner){
            query.where(`second_partner`,couple.second_partner)
        }
        query.select("*")
        return query   
    }

}

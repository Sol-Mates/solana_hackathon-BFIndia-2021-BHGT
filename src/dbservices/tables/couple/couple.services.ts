import { Injectable } from '@nestjs/common';
import { CurrencyStakeInfoDto, CoupleInfoDto } from 'src/dbservices/entities/couple.entity';
import { ICertificateInfoDto, ICoupleCurrencyInfo } from 'src/user/user.dto';
import { CoupleQueries } from './couple.queries';
@Injectable()
export class CoupleService {
    constructor(private coupleQueries: CoupleQueries) {}

    async addCodeForFirstPartner(param: CoupleInfoDto): Promise<any>{
        return this.coupleQueries.addCodeForFirstPartner(param)
    }

    async joinInvite(param: CoupleInfoDto): Promise<any>{
        return this.coupleQueries.joinInvite(param)
    }

    async doesCodeAlreadyExistForFirstPartner(param: CoupleInfoDto): Promise<CoupleInfoDto[]>{
        return this.coupleQueries.doesCodeAlreadyExistForFirstPartner(param)
    }

    async doesActiveCodeExist(params: CoupleInfoDto): Promise<CoupleInfoDto[]>{
        return this.coupleQueries.doesCodeAlreadyExistForFirstPartner(params)
    }

    async addCertificateInfo(params: ICertificateInfoDto): Promise<any>{
        return this.coupleQueries.addCertificateInfo(params)
    }

    async addCoupleCurrencyInfo(params: ICoupleCurrencyInfo[]): Promise<any>{
        return this.coupleQueries.addCoupleCurrencyInfo(params)
    }

    async addCoupleExtendedInfo(params: CurrencyStakeInfoDto):Promise<any>{
        return this.coupleQueries.addCoupleExtendedInfo(params)
    }

    async disableCoupleCurrencyInfo(coupleId: string):Promise<any>{
        return this.coupleQueries.disableCoupleCurrencyInfo(coupleId)
    }

    async fetchUsersFromCoupleInfo(params: CoupleInfoDto): Promise<CoupleInfoDto[]>{
        return this.coupleQueries.fetchUsersFromCoupleInfo(params)
    }
}
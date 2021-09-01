import { IsNotEmpty, IsEmail, Contains, IsEmpty } from 'class-validator';
import { CurrencyStakeInfoDto } from 'src/dbservices/entities/couple.entity';

export class UserDto {

    id?: number;

    name: string;

    username: string;

    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;

    isActive?: boolean;

    noErrorOnExisting?: boolean

}

export enum ICertificateType{
    MARRIAGE_CERTIFICATE='mariage_certificate',
    BIRTH_CERTIFICATE='birth_certificate'
}

export enum IInfoDataType{
    PROFILE='profile',
    CERTIFIATE='certificate',
    CURRENCY_STAKE='stake'
}
export interface ICoupleCurrencyInfo{

    coupleId: string;

    userId: number;

    currency_stake_count: number;

    currency_share_percentage: number;

    currency_wallet_address: number;

    isLatest: boolean

}

export interface IInfoData{
    infoType: IInfoDataType;
    first_partner_id: number;
    second_partner_id: number;
    content: ICoupleCurrencyInfo[] | ICertificateInfoDto;
    stakeInfo: CurrencyStakeInfoDto
}
export interface ICertificateInfoDto{
    certificateType: ICertificateType;
    
    certificateNumber: string;

    certificateDoc: string; //uploaded file from the FE of the certificate

    certificateDocQRCode: string; //storing qrcode of the uploaded document from the IPFS blockchain
    certificateTemplate: string; //template htmlcoded string
    certificateTemplateIPFS: string; //Id from IPFS of the uploaded template 
    certificateTemplateQRCode: string; //storing qrcode of the uploaded template from the IPFS blockchain
    valuesOnCertificate: string; //JSON.stringify data of array of values
    isActive: boolean;
}
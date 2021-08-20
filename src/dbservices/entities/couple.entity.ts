export class CoupleInfoDto{
    id: number;

    first_partner: number;

    second_partner: number;

    coupleId: string;
}

export class CurrencyStakeInfoDto{
    stakeCurrencyCount: number;

    stakeCurrencyName: string;

    stakeCurrencyWalletAddress: string;
    
    coupleId: string;
}
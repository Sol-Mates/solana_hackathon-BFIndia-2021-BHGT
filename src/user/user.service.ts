import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { User } from './user.entity';
import { USERS_FIXTURE } from './user.fixture';
import { ApplicationLoggerService } from 'src/logger/logger.service';
import { ICertificateType, ICertificateInfoDto, IInfoData, IInfoDataType, ICoupleCurrencyInfo, UserDto } from './user.dto';
import { UserQueries } from './user.queries';
import bcrypt from 'bcrypt'
import { IFailure, ISuccess, SuccessResponseDto } from 'src/interceptors/response.interceptor';
import { UniqueCodeService } from 'src/dbservices/tables/uniqueCode/uniqueCode.services';
import { CoupleService } from 'src/dbservices/tables/couple/couple.services';
import { CurrencyStakeInfoDto, CoupleInfoDto } from 'src/dbservices/entities/couple.entity';
import { UniqueCodeDto } from 'src/dbservices/entities/uniqueCode.entity';
const saltOrRounds = 10;
@Injectable()
export class UserService {

  constructor(private userQueries: UserQueries, private applicationLogger: ApplicationLoggerService) {
    this.applicationLogger.setContext('UserService')

  }

  @Inject()
  private uniqueCodeDBService: UniqueCodeService

  @Inject()
  private coupleDBService: CoupleService

  async findOne(params: {userId?: number, username?: string}): Promise<User[] | undefined> {
    return this.userQueries.getUser({ ...params })
  }

  async findIfUserActiveCouple(params: {userId?: number, username?: string}): Promise<User[] | undefined> {
    return this.userQueries.getUser({ ...params, isActive: true })
  }

  async saveUser(user: UserDto): Promise<SuccessResponseDto> {
    try {
      const userObj = {
        ...user,
        password: await bcrypt.hash(user.password, saltOrRounds)
      }
      await this.userQueries.saveUser(userObj)
      return {
        message: "Registration successful"
      }
    } catch (err) {
      this.applicationLogger.error(err)
      throw new HttpException("Exception occured while saving the user", 500)
    }
  }


  /**
   * Dummy method to insert data into the table;
   */
  async saveTempUsers(): Promise<any> {
    try {
      await this.userQueries.saveUser(USERS_FIXTURE.users)
      return {
        status: true,
        message: "Registration successful"
      }
    } catch (err) {
      this.applicationLogger.error(err)
      throw new HttpException("Exception occured while saving the user", 500)
    }
  }

  /**
   * Generate Invite code
   */
  async generateInviteCode(user: UserDto): Promise<SuccessResponseDto> {
    try {
      const activeCodeAlreadyExists = await this.coupleDBService.doesCodeAlreadyExistForFirstPartner({ first_partner: user.id } as CoupleInfoDto)

      if (activeCodeAlreadyExists && activeCodeAlreadyExists.length) {
        return activeCodeAlreadyExists[0].coupleId
      }

      const inviteCode = await this.uniqueCodeDBService.getNextAvailableUniqueCode()

      if (inviteCode && inviteCode.length) {
        const coupleId = inviteCode[0].uniqueCode
        await this.coupleDBService.addCodeForFirstPartner({ first_partner: user.id, coupleId } as CoupleInfoDto)
        await this.uniqueCodeDBService.updateUniqueCode({ uniqueCode: coupleId, isActive: false } as UniqueCodeDto)

        return inviteCode[0].uniqueCode
      } else {
        throw Error("No active code available")
      }
    } catch (err) {
      this.applicationLogger.error(err)
      throw new HttpException(`${err.message || 'Exception occured while generating the invite code'}`, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  /**
     * Generate Invite code
     */
  async joinInviteService(user: UserDto, invitedCode: string): Promise<SuccessResponseDto> {
    try {

      const activeCodeExists = await this.coupleDBService.doesActiveCodeExist({ coupleId: invitedCode } as CoupleInfoDto)

      if (!activeCodeExists || !activeCodeExists.length) {
        throw Error("Oops! You can't join your partner either the code has been expired or your partner is no more single")
      }

      const activeCodeAlreadyExists = await this.coupleDBService.doesCodeAlreadyExistForFirstPartner({ first_partner: user.id } as CoupleInfoDto)

      if (activeCodeAlreadyExists && activeCodeAlreadyExists.length) {
        throw Error("Oops! You can't join yourself as partner. The world is very big and we wish you will find your love soon.")
      }

      await this.coupleDBService.joinInvite({ coupleId: invitedCode, second_partner: user.id } as any)

      return "Congratulations and Wish you good luck for your new journey! You have joined your partner."
    } catch (err) {
      this.applicationLogger.error(err)
      throw new HttpException(`${err.message || 'Exception occured while joining the invite code'}`, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }


  /**
   * 
   * @param user 
   * @param body 
   */
  async saveProfile(user: UserDto, body: IInfoData): Promise<any> {
    try {

      let { first_partner_id, second_partner_id, content, infoType, stakeInfo } = body
      const coupleCode = await this.coupleDBService.doesActiveCodeExist({ first_partner: first_partner_id, second_partner: second_partner_id } as CoupleInfoDto)

      if (!coupleCode || !coupleCode.length) {
        throw Error("Couple code does not exist")
      }

      const coupleId = coupleCode[0].coupleId
      if (infoType === IInfoDataType.PROFILE) {
        await this.addOrUpdateCoupleCurrencyInfo(content as ICoupleCurrencyInfo[], coupleId)
      } else if (infoType === IInfoDataType.CERTIFIATE) {
        await this.addOrUpdateCertificateInfo(content as ICertificateInfoDto, coupleId)
      }

      if (stakeInfo) {
        await this.addOrUpdateCoupleExtendedInfo(stakeInfo as CurrencyStakeInfoDto, coupleId)
      }

    } catch (err) {
      this.applicationLogger.error(err)
      throw new HttpException(`${err.message || 'Exception occured while saving the profile'}`, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async addOrUpdateCoupleCurrencyInfo(contents: ICoupleCurrencyInfo[], coupleId: string) {

    await this.coupleDBService.disableCoupleCurrencyInfo(coupleId)
    const finalArray = []
    for (let content of contents) {
      const obj: {
        coupleId,
        userId,
        currency_stake_count,
        currency_share_percentage,
        currency_wallet_address
      } = content as ICoupleCurrencyInfo
      finalArray.push({...obj,isLatest: true})
    }
    return this.coupleDBService.addCoupleCurrencyInfo(finalArray)
  }

  async addOrUpdateCertificateInfo(info: ICertificateInfoDto, coupleId: string) {
    const {
      certificateNumber,
      certificateType,
      valuesOnCertificate,
      certificateTemplate
    } = info as ICertificateInfoDto

    const certificateInfoObj = {
      certificateNumber,
      certificateType,
      coupleId,
      isActive: true,
      certificateTemplate,
      valuesOnCertificate: JSON.stringify(valuesOnCertificate)
    } as ICertificateInfoDto

    await this.coupleDBService.addCertificateInfo(certificateInfoObj)
  }

  async addOrUpdateCoupleExtendedInfo(info: CurrencyStakeInfoDto, coupleId: string) {
    const {
      stakeCurrencyCount,
      stakeCurrencyName,
      stakeCurrencyWalletAddress,
    } = info
    const coupleExtendedInfoObj = {
      stakeCurrencyCount,
      stakeCurrencyName,
      stakeCurrencyWalletAddress,
      coupleId
    } as CurrencyStakeInfoDto

    await this.coupleDBService.addCoupleExtendedInfo(coupleExtendedInfoObj)
  }



}
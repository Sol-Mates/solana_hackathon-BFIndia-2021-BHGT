import { Injectable } from '@nestjs/common';
import { ApplicationLoggerService } from 'src/logger/logger.service';
import QRCode from 'qrcode'
@Injectable()
export class QRCodeService {

  constructor(private applicationLogger: ApplicationLoggerService){
    this.applicationLogger.setContext('QRCode Service')
  }

  async generateQRCode(data: any): Promise<any>{
    return QRCode.toDataURL(data)
  }


}

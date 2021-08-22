import { Controller, Get} from '@nestjs/common';
import { ApplicationLoggerService } from 'src/logger/logger.service';
import { QRCodeService } from './qrcode.service';

@Controller('qrcode')
export class QRCodeController {
  constructor(private readonly qrCodeService: QRCodeService, private appLogger: ApplicationLoggerService) {
   this.appLogger.setContext('IPFS Controller')
  }

  @Get()
  generateQRCode(data: any): Promise<any> {
    return this.qrCodeService.generateQRCode(data)
  }

}

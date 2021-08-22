import { Controller, Get} from '@nestjs/common';
import { ApplicationLoggerService } from 'src/logger/logger.service';
import { IPFSService } from './ipfs.service';

@Controller('ipfs')
export class IPFSController {
  constructor(private readonly ipfsService: IPFSService, private appLogger: ApplicationLoggerService) {
   this.appLogger.setContext('IPFS Controller')
  }

  @Get()
  getInstance(): Promise<any> {
    return this.ipfsService.getSingletonInstance()
  }

  @Get()
  saveToIPFS(): Promise<any> {
    return this.ipfsService.getSingletonInstance()
  }

}

import { Injectable } from '@nestjs/common';
import { ApplicationLoggerService } from 'src/logger/logger.service';
const IPFS = require('ipfs-core')
@Injectable()
export class IPFSService {

  private instance;

  constructor(private applicationLogger: ApplicationLoggerService){
    this.applicationLogger.setContext('IPFS Service')
  }

  async getSingletonInstance(){
      if(!this.instance){
        this.applicationLogger.log("Instance created of IPFS")
          this.instance = await IPFS.create()
          return this.instance
      }else{
          return this.instance;
      }
  }


  async saveDataToIPFS(data: any): Promise<any>{
    const ipfsInstance = await this.getSingletonInstance();
    return ipfsInstance.add(data) 
  }


}

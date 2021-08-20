import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserQueries } from './user.queries';
import { ApplicationLoggerService } from 'src/logger/logger.service';
import { UniqueCodeService } from 'src/dbservices/tables/uniqueCode/uniqueCode.services';
import { TableModule } from 'src/dbservices/tables/table.module';

@Module({
  imports:[TableModule],
  providers: [UserService, UserQueries, UniqueCodeService, ApplicationLoggerService],
  controllers: [UserController],
  exports:[UserService, UserQueries]
})
export class UserModule {}

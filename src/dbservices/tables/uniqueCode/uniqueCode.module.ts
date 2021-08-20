import { Module } from '@nestjs/common';
import { UniqueCodeQueries } from './uniqueCode.queries';
import { UniqueCodeService } from './uniqueCode.services';

@Module({
  providers: [UniqueCodeQueries, UniqueCodeService],
  exports:[UniqueCodeQueries, UniqueCodeService]
})
export class UniqueCodeModule{}

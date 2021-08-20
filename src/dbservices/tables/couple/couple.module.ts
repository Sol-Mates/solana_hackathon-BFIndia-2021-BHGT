import { Module } from '@nestjs/common';
import { CoupleQueries } from './couple.queries';
import { CoupleService } from './couple.services';

@Module({
  providers: [CoupleQueries, CoupleService],
  exports:[CoupleQueries, CoupleService]
})
export class CoupleModule{}

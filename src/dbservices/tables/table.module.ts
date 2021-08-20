import { Module } from '@nestjs/common';
import { CoupleQueries } from './couple/couple.queries';
import { CoupleService } from './couple/couple.services';
import { LocationsQueries } from './location/location.queries';
import { LocationServices } from './location/location.services';
import { UniqueCodeQueries } from './uniqueCode/uniqueCode.queries';
import { UniqueCodeService } from './uniqueCode/uniqueCode.services';
const modules = [
  LocationServices, LocationsQueries,
  UniqueCodeService, UniqueCodeQueries,
  CoupleService, CoupleQueries
]
@Module({
  providers: [...modules],
  exports:[...modules]
})
export class TableModule{}

import { Module } from '@nestjs/common';
import { ParseCsv } from 'src/utils/ParseCsv.utils';
import { FinanceController } from './finance.controller';
import { FinanceService } from './finance.service';

@Module({
  controllers: [FinanceController],
  providers: [FinanceService, ParseCsv],
})
export class FinanceModule {}

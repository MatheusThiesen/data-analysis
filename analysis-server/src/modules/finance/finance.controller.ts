import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetCurrentUserId } from 'src/common/decorators/get-current-user-id.decorator';
import { FinanceService } from './finance.service';

@Controller('finance')
export class FinanceController {
  constructor(private readonly financeService: FinanceService) {}

  @Post('/releases/import')
  @UseInterceptors(FileInterceptor('file'))
  importReleases(
    @UploadedFile() file: Express.Multer.File,
    @GetCurrentUserId() userId: string,
  ) {
    return this.financeService.importFinanceReleases(file, userId);
  }

  @Post('/plans/import')
  @UseInterceptors(FileInterceptor('file'))
  importPlans(
    @UploadedFile() file: Express.Multer.File,
    @GetCurrentUserId() userId: string,
  ) {
    return this.financeService.importFinancePlans(file, userId);
  }
}

import { Module } from '@nestjs/common';
import { NotifierService } from './notifier.service';

@Module({
    providers: [NotifierService],
    exports: [NotifierService]
  })
export class NotifierModule {}

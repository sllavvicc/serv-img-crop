import { Module } from '@nestjs/common';
import { AttachmentsStaticController } from './modules/attachments/attachments-static.controller';
import { AttachmentsResizeService } from './modules/attachments/attachments-resize.service';
import { AttachmentsService } from './modules/attachments/attachments.service';

@Module({
  imports: [],
  controllers: [AttachmentsStaticController],
  providers: [AttachmentsService, AttachmentsResizeService],
})
export class AppModule {
}

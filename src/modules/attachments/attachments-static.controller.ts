import { Controller, Get, HttpCode, HttpStatus, Param, Res } from '@nestjs/common';
import { AttachmentsService } from './attachments.service';

@Controller('uploads')
export class AttachmentsStaticController {
  constructor(
    private readonly _attachmentsService: AttachmentsService,
  ) {
  }

  /**
   * @description Get single original image from disk
   * @param itemName
   * @param response
   */
  @Get('images/original/:itemName')
  @HttpCode(HttpStatus.OK)
  async getSingleOriginalImage(
    @Param('itemName') itemName: string,
    @Res() response,
  ): Promise<any> {
    const filePath = await this._attachmentsService.getOneImageWithResize('original', itemName);
    response.sendFile(filePath, { root: './' });
  }

  /**
   * @description Get single thumbs image from disk
   * @param size
   * @param itemName
   * @param response
   */
  @Get('images/thumbs/:size/:itemName')
  @HttpCode(HttpStatus.OK)
  async getSingleResizedImage(
    @Param('size') size: string,
    @Param('itemName') itemName: string,
    @Res() response,
  ): Promise<any> {
    const filePath = await this._attachmentsService.getOneImageWithResize(size, itemName);
    response.sendFile(filePath, { root: './' });
  }
}

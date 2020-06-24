import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger, NotFoundException,
} from '@nestjs/common';
import { existsSync } from 'fs';
import { AttachmentsResizeService } from './attachments-resize.service';
import { fileExistsSync } from 'tsconfig-paths/lib/filesystem';
import { OutputFormats } from './enums/outputFormats.interface';

@Injectable()
export class AttachmentsService {
  private readonly _logger: Logger = new Logger('AttachmentsService');

  constructor(private readonly _attachmentsResizeService: AttachmentsResizeService) {
  }

  /**
   * @description Select single attachment with resize
   * @param sizeType
   * @param itemName
   */
  async getOneImageWithResize(sizeType: string, itemName: string): Promise<string> {
    const originalImageFullPath = `uploads/images/original/${itemName}`;
    const originalImageExist = await AttachmentsService._checkFileExitByFileName(`uploads/images/original`, itemName);

    /** Check if image original exist */
    if (!originalImageExist) {
      this._logger.warn(`Image: ${originalImageFullPath} not found.`);
      throw new NotFoundException(`Original image with name ${itemName} not found.`);
    }

    /** Check if need to return original image */
    if (sizeType === 'original') {
      return originalImageFullPath;
    }

    /** Parse params for resize */
    const sizeX = parseInt(sizeType.split('x')[0], 10);
    const sizeY = parseInt(sizeType.split('x')[1], 10);
    let sizeQ = parseInt(sizeType.split('x')[2], 10);

    /** Check if provided params for resize is not ok or not provided */
    if (!sizeX && !sizeY && !sizeQ) {
      this._logger.warn('Error parse image resize params.');
      throw new BadRequestException('Please check provided thumb params.');
    }

    /** Check range of quality */
    sizeQ = sizeQ > 0 && sizeQ <= 100 ? sizeQ : 100;

    /** Check if have thumb version of image and return image path if exist */
    const resizedImageFullPath = `uploads/images/thumbs/${sizeX}x${sizeY}x${sizeQ ? sizeQ : 100}/${itemName}`;
    const resizedImageExist = await AttachmentsService._checkFileExitByFileName(
      `uploads/images/thumbs/${sizeX}x${sizeY}x${sizeQ ? sizeQ : 100}`, itemName);

    if (resizedImageFullPath && resizedImageExist) {
      return resizedImageFullPath;
    }

    /* Если нужного размера нет, тогда делаем запрос на обрезку фотографий и отдаем обратно ее путь и пишем в базу новый размер. */
    const originalFilePath = `uploads/images/original`;
    const newResizedImage = await this._attachmentsResizeService
      .resizeSingleWithSize(originalFilePath, itemName, sizeX, sizeY, OutputFormats.jpg, sizeQ ? sizeQ : 100);

    /** Return resized image path */
    if (newResizedImage) {
      return newResizedImage.path;
    }

    this._logger.error(`Could not find the file you want.`);
    throw new NotFoundException();
  }

  /**
   * @description Check if file exist
   * @param filePath
   * @param fileName
   * @private
   */
  private static async _checkFileExitByFileName(filePath: string, fileName: string): Promise<any> {
    return fileExistsSync(`${filePath}/${fileName}`);
  }
}

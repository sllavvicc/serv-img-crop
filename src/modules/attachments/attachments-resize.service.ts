import { Injectable, Logger } from '@nestjs/common';
import { OutputFormats } from './enums/outputFormats.interface';
import { existsSync, mkdirSync } from 'fs';
import * as sharp from 'sharp';

@Injectable()
export class AttachmentsResizeService {
  /**
   * @description Обрезка одной фотографий
   * @param inputFilePath
   * @param inputFileName
   * @param outputSizeX
   * @param outputSizeY
   * @param outputFormat
   * @param quality
   */
  async resizeSingleWithSize(inputFilePath: string, inputFileName: string, outputSizeX: number, outputSizeY: number, outputFormat: OutputFormats, quality: number): Promise<any> {
    const outputFilePath = inputFilePath.replace('original', `thumbs/${outputSizeX}x${outputSizeY}x${quality}`);
    if (!existsSync(outputFilePath)) {
      mkdirSync(outputFilePath, { recursive: true });
    }
    const resizeResponse = await this._sharpEngineResize(inputFilePath, inputFileName, outputFilePath, inputFileName, outputSizeX, outputSizeY, outputFormat, quality);
    return {
      destination: outputFilePath,
      filename: inputFileName,
      path: `${outputFilePath}/${inputFileName}`,
      size: resizeResponse.size,
      sizeX: resizeResponse.width,
      sizeY: resizeResponse.height,
      quality: quality,
    };
  }

  /**
   * @description Обраттка обрезки фотографий
   * @param inputFilePath
   * @param inputFileName
   * @param outputFilePath
   * @param outputFileName
   * @param outputSizeX
   * @param outputSizeY
   * @param outputFormat
   * @param quality
   */
  private async _sharpEngineResize(inputFilePath: string, inputFileName: string, outputFilePath: string, outputFileName: string, outputSizeX: number, outputSizeY: number, outputFormat: OutputFormats, quality: number): Promise<any> {
    return sharp(`${inputFilePath}/${inputFileName}`)
      .resize(outputSizeX, outputSizeY, { withoutEnlargement: true })
      .toFormat(outputFormat, { quality: quality })
      .toFile(`${outputFilePath}/${outputFileName}`)
      .then(data => data)
      .catch(err => Logger.warn(err, 'AttachmentsResizeService'));
  }
}

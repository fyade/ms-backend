import { Body, Controller, Get, Param, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { R } from '../../common/R';
import { FileInterceptor } from '@nestjs/platform-express';
import { currentEnv } from '../../config/config';
import { params_fileUploadOneChunk_check, params_fileUploadOneChunk_merge, selListDto } from './dto';
import { pageSelDto } from '../../common/dto/PageDto';

@Controller('file-upload')
export class FileUploadController {
  private env: any;

  constructor(private readonly fileUploadService: FileUploadService) {
    this.env = currentEnv();
  }

  @Get()
  async selList(@Query() dto: selListDto): Promise<R> {
    return this.fileUploadService.selList(dto);
  }

  @Post('one-full')
  @UseInterceptors(FileInterceptor('file'))
  async fileUploadOneFull0(@UploadedFile() file): Promise<R> {
    if (file.size > this.env.file.maxSizeOfFull) {
      return R.err('文件大小超出限制。');
    }
    return this.fileUploadService.fileUploadOneFull(file);
  }

  @Post('one-full/:filename')
  @UseInterceptors(FileInterceptor('file'))
  async fileUploadOneFull(@Param() param, @UploadedFile() file): Promise<R> {
    if (file.size > this.env.file.maxSizeOfFull) {
      return R.err('文件大小超出限制。');
    }
    return this.fileUploadService.fileUploadOneFull(file, param.filename);
  }

  @Post('one-chunk/check')
  async fileUploadOneChunkCheck(@Body() dto: params_fileUploadOneChunk_check): Promise<R> {
    return this.fileUploadService.fileUploadOneChunkCheck(dto);
  }

  @Post('one-chunk/upload/:fileMd5/:fileNewName/:chunkIndex')
  @UseInterceptors(FileInterceptor('file'))
  async fileUploadOneChunkUpload(@Param() param, @UploadedFile() file): Promise<R> {
    return this.fileUploadService.fileUploadOneChunkUpload({
      fileMd5: param.fileMd5,
      chunkIndex: param.chunkIndex,
      fileNewName: param.fileNewName,
      file: file,
    });
  }

  @Post('one-chunk/merge')
  async fileUploadOneChunkMerge(@Body() dto: params_fileUploadOneChunk_merge): Promise<R> {
    return this.fileUploadService.fileUploadOneChunkMerge(dto);
  }

  @Get('image-waterfall-flow')
  async getImageWaterfallFlow(@Query() dto: pageSelDto) {
    return this.fileUploadService.getImageWaterfallFlow(dto);
  }
}

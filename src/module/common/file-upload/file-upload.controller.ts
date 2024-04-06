import { Body, Controller, Get, Param, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { R } from '../../../common/R';
import { FileInterceptor } from '@nestjs/platform-express';
import { currentEnv } from '../../../config/config';
import { params_fileUploadOneChunk_check, params_fileUploadOneChunk_merge, selListDto } from './dto';
import { pageSelDto } from '../../../common/dto/PageDto';
import { Authorize } from '../../../decorator/authorizeDecorator';
import { ApiTags } from '@nestjs/swagger';

@Controller('/sys/file-upload')
@ApiTags('文件上传')
export class FileUploadController {
  private env: any;

  constructor(private readonly fileUploadService: FileUploadService) {
    this.env = currentEnv();
  }

  @Get()
  @Authorize('system:fileupload:selList')
  async selList(@Query() dto: selListDto): Promise<R> {
    return this.fileUploadService.selList(dto);
  }

  @Post('/one-full')
  @UseInterceptors(FileInterceptor('file'))
  @Authorize('system:fileupload:onefull0')
  async fileUploadOneFull0(@UploadedFile() file): Promise<R> {
    if (file.size > this.env.file.maxSizeOfFull) {
      return R.err('文件大小超出限制。');
    }
    return this.fileUploadService.fileUploadOneFull(file);
  }

  @Post('/one-full/:filename')
  @UseInterceptors(FileInterceptor('file'))
  @Authorize('system:fileupload:onefull')
  async fileUploadOneFull(@Param() param, @UploadedFile() file): Promise<R> {
    if (file.size > this.env.file.maxSizeOfFull) {
      return R.err('文件大小超出限制。');
    }
    return this.fileUploadService.fileUploadOneFull(file, param.filename);
  }

  @Post('/one-chunk/check')
  @Authorize('system:fileupload:onechunkcheck')
  async fileUploadOneChunkCheck(@Body() dto: params_fileUploadOneChunk_check): Promise<R> {
    return this.fileUploadService.fileUploadOneChunkCheck(dto);
  }

  @Post('/one-chunk/upload/:fileMd5/:fileNewName/:chunkIndex')
  @UseInterceptors(FileInterceptor('file'))
  @Authorize('system:fileupload:onechunkupload')
  async fileUploadOneChunkUpload(@Param() param, @UploadedFile() file): Promise<R> {
    return this.fileUploadService.fileUploadOneChunkUpload({
      fileMd5: param.fileMd5,
      chunkIndex: param.chunkIndex,
      fileNewName: param.fileNewName,
      file: file,
    });
  }

  @Post('/one-chunk/merge')
  @Authorize('system:fileupload:onechunkmerge')
  async fileUploadOneChunkMerge(@Body() dto: params_fileUploadOneChunk_merge): Promise<R> {
    return this.fileUploadService.fileUploadOneChunkMerge(dto);
  }

  @Get('/image-waterfall-flow')
  @Authorize('system:fileupload:waterfall')
  async getImageWaterfallFlow(@Query() dto: pageSelDto) {
    return this.fileUploadService.getImageWaterfallFlow(dto);
  }
}

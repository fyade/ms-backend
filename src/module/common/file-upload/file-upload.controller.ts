import { Body, Controller, Get, Param, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { R } from '../../../common/R';
import { FileInterceptor } from '@nestjs/platform-express';
import { currentEnv } from '../../../../config/config';
import { params_fileUploadOneChunk_check, params_fileUploadOneChunk_merge, selListDto } from './dto';
import { pageSelDto } from '../../../common/dto/PageDto';
import { Authorize } from '../../../decorator/authorizeDecorator';
import { ApiTags } from '@nestjs/swagger';

@Controller('/sys-common/file-upload')
@ApiTags('文件上传')
export class FileUploadController {
  private env: any;

  constructor(private readonly fileUploadService: FileUploadService) {
    this.env = currentEnv();
  }

  @Get()
  @Authorize({
    permission: 'system:fileupload:selList',
    label: '分页查询文件上传列表',
  })
  async selList(@Query() dto: selListDto): Promise<R> {
    return this.fileUploadService.selList(dto);
  }

  @Post('/one-full')
  @UseInterceptors(FileInterceptor('file'))
  @Authorize({
    permission: 'system:fileupload:onefull0',
    label: '文件上传-单文件完整上传',
  })
  async fileUploadOneFull0(@UploadedFile() file): Promise<R> {
    if (file.size > this.env.file.maxSizeOfFull) {
      return R.err('文件大小超出限制。');
    }
    return this.fileUploadService.fileUploadOneFull(file);
  }

  @Post('/one-full/:filename')
  @UseInterceptors(FileInterceptor('file'))
  @Authorize({
    permission: 'system:fileupload:onefull',
    label: '文件上传-单文件完整上传',
  })
  async fileUploadOneFull(@Param() param, @UploadedFile() file): Promise<R> {
    if (file.size > this.env.file.maxSizeOfFull) {
      return R.err('文件大小超出限制。');
    }
    return this.fileUploadService.fileUploadOneFull(file, { filename: param.filename });
  }

  @Post('/one-full-avatar')
  @UseInterceptors(FileInterceptor('file'))
  @Authorize({
    permission: 'system:fileupload:avatar',
    label: '文件上传-头像',
  })
  async fileUploadAvatar(@Param() param, @UploadedFile() file): Promise<R> {
    if (file.size > this.env.file.maxSizeOfFull) {
      return R.err('文件大小超出限制。');
    }
    return this.fileUploadService.fileUploadOneFull(file, { filename: param.filename, module: 'avatar' });
  }

  @Post('/one-chunk/check')
  @Authorize({
    permission: 'system:fileupload:onechunkcheck',
    label: '文件上传-单文件分片上传前检查',
  })
  async fileUploadOneChunkCheck(@Body() dto: params_fileUploadOneChunk_check): Promise<R> {
    return this.fileUploadService.fileUploadOneChunkCheck(dto);
  }

  @Post('/one-chunk/upload/:fileMd5/:fileNewName/:chunkIndex')
  @UseInterceptors(FileInterceptor('file'))
  @Authorize({
    permission: 'system:fileupload:onechunkupload',
    label: '文件上传-单文件分片上传',
  })
  async fileUploadOneChunkUpload(@Param() param, @UploadedFile() file): Promise<R> {
    return this.fileUploadService.fileUploadOneChunkUpload({
      fileMd5: param.fileMd5,
      chunkIndex: param.chunkIndex,
      fileNewName: param.fileNewName,
      file: file,
    });
  }

  @Post('/one-chunk/merge')
  @Authorize({
    permission: 'system:fileupload:onechunkmerge',
    label: '文件上传-单文件分片上传分片合并',
  })
  async fileUploadOneChunkMerge(@Body() dto: params_fileUploadOneChunk_merge): Promise<R> {
    return this.fileUploadService.fileUploadOneChunkMerge(dto);
  }

  // @Get('/image-waterfall-flow')
  // @Authorize('system:fileupload:waterfall')
  // async getImageWaterfallFlow(@Query() dto: pageSelDto) {
  //   return this.fileUploadService.getImageWaterfallFlow(dto);
  // }
}

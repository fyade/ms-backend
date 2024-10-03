import { Body, Controller, Get, Param, Post, Query, UploadedFile, UseInterceptors, UsePipes } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { R } from '../../../../../common/R';
import { FileInterceptor } from '@nestjs/platform-express';
import { currentEnv } from '../../../../../../config/config';
import {
  fileUploadSelListDto,
  fileUploadOneChunk_check,
  fileUploadOneChunk_merge,
  fileUploadOneChunk_upload,
} from './dto';
import { Authorize } from '../../../../../decorator/authorizeDecorator';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ValidationPipe } from '../../../../../pipe/validation/validation.pipe';

@Controller('/main/sys-common/file-upload')
@ApiTags('通用/文件上传')
@ApiBearerAuth()
@UsePipes(new ValidationPipe())
export class FileUploadController {
  private env: any;

  constructor(private readonly fileUploadService: FileUploadService) {
    this.env = currentEnv();
  }

  @Get()
  @ApiOperation({
    summary: '分页查询文件上传列表',
  })
  @Authorize({
    permission: 'main:system:fileupload:selList',
    label: '分页查询文件上传列表',
  })
  async selList(@Query() dto: fileUploadSelListDto): Promise<R> {
    return this.fileUploadService.selList(dto);
  }

  @Post('/one-full')
  @ApiOperation({
    summary: '文件上传-单文件完整上传',
  })
  @UseInterceptors(FileInterceptor('file'))
  @Authorize({
    permission: 'main:system:fileupload:onefull0',
    label: '文件上传-单文件完整上传',
  })
  async fileUploadOneFull0(@UploadedFile() file): Promise<R> {
    if (file.size > this.env.file.maxSizeOfFull) {
      return R.err('文件大小超出限制。');
    }
    return this.fileUploadService.fileUploadOneFull(file);
  }

  @Post('/one-full/:filename')
  @ApiOperation({
    summary: '文件上传-单文件完整上传',
  })
  @UseInterceptors(FileInterceptor('file'))
  @Authorize({
    permission: 'main:system:fileupload:onefull',
    label: '文件上传-单文件完整上传',
  })
  async fileUploadOneFull(@Param() param, @UploadedFile() file): Promise<R> {
    if (file.size > this.env.file.maxSizeOfFull) {
      return R.err('文件大小超出限制。');
    }
    return this.fileUploadService.fileUploadOneFull(file, { filename: param.filename });
  }

  @Post('/one-full-avatar')
  @ApiOperation({
    summary: '文件上传-头像',
  })
  @UseInterceptors(FileInterceptor('file'))
  @Authorize({
    permission: 'main:system:fileupload:avatar',
    label: '文件上传-头像',
  })
  async fileUploadAvatar(@Param() param, @UploadedFile() file): Promise<R> {
    if (file.size > this.env.file.maxSizeOfFull) {
      return R.err('文件大小超出限制。');
    }
    return this.fileUploadService.fileUploadOneFull(file, { filename: param.filename, module: 'avatar' });
  }

  @Post('/one-chunk/check')
  @ApiOperation({
    summary: '文件上传-单文件分片上传前检查',
  })
  @Authorize({
    permission: 'main:system:fileupload:onechunkcheck',
    label: '文件上传-单文件分片上传前检查',
  })
  async fileUploadOneChunkCheck(@Body() dto: fileUploadOneChunk_check): Promise<R> {
    return this.fileUploadService.fileUploadOneChunkCheck(dto);
  }

  @Post('/one-chunk/upload/:fileMd5/:fileNewName/:chunkIndex')
  @ApiOperation({
    summary: '文件上传-单文件分片上传',
  })
  @UseInterceptors(FileInterceptor('file'))
  @Authorize({
    permission: 'main:system:fileupload:onechunkupload',
    label: '文件上传-单文件分片上传',
  })
  async fileUploadOneChunkUpload(@Param() param: fileUploadOneChunk_upload, @UploadedFile() file): Promise<R> {
    return this.fileUploadService.fileUploadOneChunkUpload({
      fileMd5: param.fileMd5,
      chunkIndex: param.chunkIndex,
      fileNewName: param.fileNewName,
      file: file,
    });
  }

  @Post('/one-chunk/merge')
  @ApiOperation({
    summary: '文件上传-单文件分片上传分片合并',
  })
  @Authorize({
    permission: 'main:system:fileupload:onechunkmerge',
    label: '文件上传-单文件分片上传分片合并',
  })
  async fileUploadOneChunkMerge(@Body() dto: fileUploadOneChunk_merge): Promise<R> {
    return this.fileUploadService.fileUploadOneChunkMerge(dto);
  }

  // @Get('/image-waterfall-flow')
  // @Authorize('main:system:fileupload:waterfall')
  // async getImageWaterfallFlow(@Query() dto: pageDto) {
  //   return this.fileUploadService.getImageWaterfallFlow(dto);
  // }
}

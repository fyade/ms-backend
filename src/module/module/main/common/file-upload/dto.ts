import { PageDto } from '../../../../../common/dto/PageDto';
import { ApiProperty } from '@nestjs/swagger';

export class FileUploadSelListDto extends PageDto {
  @ApiProperty({ description: '过滤相同文件', required: false })
  filterSame: string;
}

export class FileUploadOneChunk_check {
  @ApiProperty({ description: '文件名', required: false })
  fileName: string;

  @ApiProperty({ description: '文件md5', required: false })
  fileMd5: string;

  @ApiProperty({ description: '文件大小', required: false })
  fileSize: number;

  @ApiProperty({ description: '分片数量', required: false })
  chunkNum: number;
}

export class FileUploadOneChunk_upload {
  @ApiProperty({ description: '文件md5', required: false })
  fileMd5: string;

  @ApiProperty({ description: '新文件名', required: false })
  fileNewName: string;

  @ApiProperty({ description: '分片下标', required: false })
  chunkIndex: number;

  @ApiProperty({ description: '文件', required: false })
  file: any;
}

export class FileUploadOneChunk_merge {
  @ApiProperty({ description: '新文件名', required: false })
  fileNewName: string;

  @ApiProperty({ description: '文件md5', required: false })
  fileMd5: string;
}

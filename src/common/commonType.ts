import { ApiProperty } from '@nestjs/swagger';

export class baseInterface {
  @ApiProperty({ description: 'createBy', required: false })
  createBy: string;

  @ApiProperty({ description: 'updateBy', required: false })
  updateBy: string;

  @ApiProperty({ description: 'createTime', required: false })
  createTime: Date;

  @ApiProperty({ description: 'updateTime', required: false })
  updateTime: Date;

  @ApiProperty({ description: 'deleted', required: false })
  deleted: string;
}

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

export const base = {
  Y: 'Y',
  N: 'N',
  DEV: 'dev',
  TEST: 'test',
  PROD: 'prod',
};

export const publicDict = {
  id: '主键id',
  remark: '备注',
  orderNum: '顺序',
  ifDefault: '是否默认',
  ifDisabled: '是否禁用',
  createBy: 'createBy',
  updateBy: 'updateBy',
  createTime: 'createTime',
  updateTime: 'updateTime',
  deleted: '逻辑删除',
};

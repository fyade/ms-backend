import { BaseDto } from '../../../../../common/dto/BaseDto';
import { PageDto } from '../../../../../common/dto/PageDto';
import { IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class LogScheduledTaskDto extends BaseDto {
  id: number;

  teskId: number;

  operateType: string;

  ifSuccess: string;

  remark: string;
}

export class LogScheduledTaskSelListDto extends PageDto {
  @ApiProperty({ description: '任务id', required: false })
  teskId: number;

  @ApiProperty({ description: '运行类型', required: false })
  operateType: string;

  @ApiProperty({ description: '是否成功', required: false })
  ifSuccess: string;

  @ApiProperty({ description: '备注', required: false })
  remark: string;
}

export class LogScheduledTaskSelAllDto {
  @ApiProperty({ description: '任务id', required: false })
  teskId: number;

  @ApiProperty({ description: '运行类型', required: false })
  operateType: string;

  @ApiProperty({ description: '是否成功', required: false })
  ifSuccess: string;

  @ApiProperty({ description: '备注', required: false })
  remark: string;
}

export class LogScheduledTaskInsOneDto {
  @ApiProperty({ description: '任务id', required: true })
  @Type(() => Number)
  @IsNotEmpty({ message: '任务id不能为空' })
  teskId: number;

  @ApiProperty({ description: '运行类型', required: true })
  @IsNotEmpty({ message: '运行类型不能为空' })
  operateType: string;

  @ApiProperty({ description: '是否成功', required: true })
  @IsNotEmpty({ message: '是否成功不能为空' })
  ifSuccess: string;

  @ApiProperty({ description: '备注', required: false })
  remark: string;
}

export class LogScheduledTaskUpdOneDto extends LogScheduledTaskInsOneDto {
  @ApiProperty({ description: '主键id', required: true })
  @IsNotEmpty({ message: '主键id不能为空' })
  id: number;
}

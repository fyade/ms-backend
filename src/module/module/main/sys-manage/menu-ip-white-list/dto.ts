import { BaseDto } from '../../../../../common/dto/BaseDto';
import { PageDto } from '../../../../../common/dto/PageDto';
import { IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class MenuIpWhiteListDto extends BaseDto {
  id: number;

  menuId: number;

  ipWhiteList: string;

  type: string;

  remark: string;
}

export class MenuIpWhiteListSelListDto extends PageDto {
  @ApiProperty({ description: '主键id', required: false })
  id: number;

  @ApiProperty({ description: '菜单', required: false })
  menuId: number;

  @ApiProperty({ description: 'ip白名单', required: false })
  ipWhiteList: string;

  @ApiProperty({ description: '白名单类型', required: false })
  type: string;

  @ApiProperty({ description: '备注', required: false })
  remark: string;
}

export class MenuIpWhiteListSelAllDto {
  @ApiProperty({ description: '菜单', required: false })
  menuId: number;

  @ApiProperty({ description: 'ip白名单', required: false })
  ipWhiteList: string;

  @ApiProperty({ description: '白名单类型', required: false })
  type: string;

  @ApiProperty({ description: '备注', required: false })
  remark: string;
}

export class MenuIpWhiteListInsOneDto {
  @ApiProperty({ description: '菜单', required: true })
  @Type(() => Number)
  @IsNotEmpty({ message: '菜单不能为空' })
  menuId: number;

  @ApiProperty({ description: 'ip白名单', required: true })
  @IsNotEmpty({ message: 'ip白名单不能为空' })
  ipWhiteList: string;

  @ApiProperty({ description: '白名单类型', required: true })
  @IsNotEmpty({ message: '白名单类型不能为空' })
  type: string;

  @ApiProperty({ description: '备注', required: false })
  remark: string;
}

export class MenuIpWhiteListUpdOneDto extends MenuIpWhiteListInsOneDto {
  @ApiProperty({ description: '主键id', required: true })
  @IsNotEmpty({ message: '主键id不能为空' })
  id: number;
}

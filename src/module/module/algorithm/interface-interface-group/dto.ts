import { pageDto } from '../../../../common/dto/PageDto';
import { baseInterface } from '../../../../common/commonType';
import { IsArray, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class interfaceInterfaceGroupDto extends baseInterface {
  id: number;

  interfaceId: number;

  interfaceGroupId: number;

  remark: string;
}

export class interfaceInterfaceGroupSelListDto extends pageDto {
  @ApiProperty({ description: '主键id', required: false })
  id: number;

  @ApiProperty({ description: '接口', required: false })
  interfaceId: number;

  @ApiProperty({ description: '接口组', required: false })
  interfaceGroupId: number;

  @ApiProperty({ description: '备注', required: false })
  remark: string;
}

export class interfaceInterfaceGroupSelAllDto {
  @ApiProperty({ description: '接口', required: false })
  interfaceId: number;

  @ApiProperty({ description: '接口组', required: false })
  interfaceGroupId: number;

  @ApiProperty({ description: '备注', required: false })
  remark: string;
}

export class interfaceInterfaceGroupInsOneDto {
  @ApiProperty({ description: '接口', required: true })
  @Type(() => Number)
  @IsNotEmpty({ message: '接口不能为空' })
  interfaceId: number;

  @ApiProperty({ description: '接口组', required: true })
  @Type(() => Number)
  @IsNotEmpty({ message: '接口组不能为空' })
  interfaceGroupId: number;

  @ApiProperty({ description: '备注', required: false })
  remark: string;
}

export class interfaceInterfaceGroupUpdOneDto extends interfaceInterfaceGroupInsOneDto {
  @ApiProperty({ description: '主键id', required: true })
  @IsNotEmpty({ message: '主键id不能为空' })
  id: number;
}

export class interfaceInterfaceGroupUpdIIGDto {
  @ApiProperty({ description: '接口', required: true })
  @Type(() => Number)
  @IsNotEmpty({ message: '接口不能为空' })
  interfaceId: number;

  @ApiProperty({ description: '接口组', required: true })
  @Type(() => Number)
  @IsArray({ message: '接口组应为数组' })
  interfaceGroupId: number[];
}

export class interfaceInterfaceGroupUpdIGIDto {
  @ApiProperty({ description: '接口', required: true })
  @Type(() => Number)
  @IsArray({ message: '接口应为数组' })
  interfaceId: number[];

  @ApiProperty({ description: '接口组', required: true })
  @Type(() => Number)
  @IsNotEmpty({ message: '接口组不能为空' })
  interfaceGroupId: number;
}

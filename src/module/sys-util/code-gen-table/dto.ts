import { pageSelDto } from '../../../common/dto/PageDto';
import { baseInterface } from '../../../util/base';
import { IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class codeGenTableDto extends baseInterface {
  id: number;

  tableName: string;

  tableDescr: string;

  entityName: string;

  tableRemark: string;

  moduleName: string;

  businessName: string;

  orderNum: number;
}

export class selListDto extends pageSelDto {
  id: number;

  tableName: string;

  tableDescr: string;

  entityName: string;

  tableRemark: string;

  moduleName: string;

  businessName: string;

  orderNum: number;
}

export class selAllDto {
  tableName: string;

  tableDescr: string;

  entityName: string;

  tableRemark: string;

  moduleName: string;

  businessName: string;

  orderNum: number;
}

export class insOneDto {
  @IsNotEmpty({ message: '表名称不能为空' })
  tableName: string;

  @IsNotEmpty({ message: '表描述不能为空' })
  tableDescr: string;

  @IsNotEmpty({ message: '实体类名不能为空' })
  entityName: string;

  tableRemark: string;

  @IsNotEmpty({ message: '模块名不能为空' })
  moduleName: string;

  @IsNotEmpty({ message: '业务名不能为空' })
  businessName: string;

  @Type(() => Number)
  @IsNotEmpty({ message: '顺序不能为空' })
  orderNum: number;
}

export class updOneDto extends insOneDto {
  @IsNotEmpty({ message: '主键id不能为空' })
  id: number;
}

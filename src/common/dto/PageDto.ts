import { Min } from 'class-validator';
import { Type } from 'class-transformer';

export class pageSelDto {
  @Type(() => Number)
  @Min(1, { message: 'pageNum最小值为1' })
  pageNum: number;

  @Type(() => Number)
  @Min(1, { message: 'pageSize最小值为1' })
  pageSize: number;

  orderBy: boolean;
}

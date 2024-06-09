import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { R } from '../../../common/R';
import { codeGenColumnDto, insOneDto, selAllDto, selListDto, updOneDto } from './dto';

@Injectable()
export class CodeGenColumnService {
  constructor(private readonly prisma: PrismaService) {
  }

  async selCodeGenColumn(dto: selListDto): Promise<R> {
    dto.tableId = Number(dto.tableId);
    const res = await this.prisma.findPage<codeGenColumnDto, selListDto>('sys_code_gen_column', {
      data: dto,
      orderBy: true,
      notNullKeys: ['tableId', 'colName', 'colDescr', 'mysqlType', 'tsType', 'tsName', 'ifIns', 'ifUpd', 'ifSelOne', 'ifSelMore', 'ifRequired', 'selType', 'formType', 'orderNum'],
      numberKeys: ['tableId', 'orderNum'],
    });
    return R.ok(res);
  }

  async selAll(dto: selAllDto): Promise<R> {
    const res = await this.prisma.findAll('sys_code_gen_column', {
      data: dto,
      orderBy: true,
      notNullKeys: ['tableId', 'colName', 'colDescr', 'mysqlType', 'tsType', 'tsName', 'ifIns', 'ifUpd', 'ifSelOne', 'ifSelMore', 'ifRequired', 'selType', 'formType', 'orderNum'],
      numberKeys: ['tableId', 'orderNum'],
    });
    return R.ok(res);
  }

  async selOnes(ids: any[]): Promise<R> {
    const res = await this.prisma.findByIds('sys_code_gen_column', Object.values(ids).map(n => Number(n)));
    return R.ok(res);
  }

  async selOne(id: number): Promise<R> {
    const res = await this.prisma.findById('sys_code_gen_column', Number(id));
    return R.ok(res);
  }

  async insCodeGenColumn(dto: insOneDto): Promise<R> {
    const res = await this.prisma.create('sys_code_gen_column', dto);
    return R.ok(res);
  }

  async insCodeGenColumns(dtos: insOneDto[]): Promise<R> {
    const res = await this.prisma.createMany('sys_code_gen_column', dtos);
    return R.ok(res);
  }

  async updCodeGenColumn(dto: updOneDto): Promise<R> {
    const res = await this.prisma.updateById('sys_code_gen_column', dto);
    return R.ok(res);
  }

  async updCodeGenColumns(dtos: updOneDto[]): Promise<R> {
    const res = await this.prisma.updateMany('sys_code_gen_column', dtos);
    return R.ok(res);
  }

  async delCodeGenColumn(ids: any[]): Promise<R> {
    const res = await this.prisma.deleteById('sys_code_gen_column', ids);
    return R.ok(res);
  }
}

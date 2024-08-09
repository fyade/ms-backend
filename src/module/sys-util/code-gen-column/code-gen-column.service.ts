import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { R } from '../../../common/R';
import { codeGenColumnDto, codeGenColumnSelListDto, codeGenColumnSelAllDto, codeGenColumnInsOneDto, codeGenColumnUpdOneDto } from './dto';

@Injectable()
export class CodeGenColumnService {
  constructor(private readonly prisma: PrismaService) {
  }

  async selCodeGenColumn(dto: codeGenColumnSelListDto): Promise<R> {
    const res = await this.prisma.findPage<codeGenColumnDto, codeGenColumnSelListDto>('sys_code_gen_column', {
      data: dto,
      orderBy: true,
      notNullKeys: ['tableId', 'colName', 'colDescr', 'mysqlType', 'tsType', 'tsName', 'ifIns', 'ifUpd', 'ifSelOne', 'ifSelMore', 'ifRequired', 'selType', 'formType', 'orderNum'],
      numberKeys: ['tableId', 'orderNum'],
    });
    return R.ok(res);
  }

  async selAllCodeGenColumn(dto: codeGenColumnSelAllDto): Promise<R> {
    const res = await this.prisma.findAll<codeGenColumnDto>('sys_code_gen_column', {
      data: dto,
      orderBy: true,
      notNullKeys: ['tableId', 'colName', 'colDescr', 'mysqlType', 'tsType', 'tsName', 'ifIns', 'ifUpd', 'ifSelOne', 'ifSelMore', 'ifRequired', 'selType', 'formType', 'orderNum'],
      numberKeys: ['tableId', 'orderNum'],
    });
    return R.ok(res);
  }

  async selOnesCodeGenColumn(ids: number[]): Promise<R> {
    const res = await this.prisma.findByIds<codeGenColumnDto>('sys_code_gen_column', Object.values(ids).map(n => Number(n)));
    return R.ok(res);
  }

  async selOneCodeGenColumn(id: number): Promise<R> {
    const res = await this.prisma.findById<codeGenColumnDto>('sys_code_gen_column', Number(id));
    return R.ok(res);
  }

  async insCodeGenColumn(dto: codeGenColumnInsOneDto): Promise<R> {
    const res = await this.prisma.create<codeGenColumnDto>('sys_code_gen_column', dto);
    return R.ok(res);
  }

  async insCodeGenColumns(dtos: codeGenColumnInsOneDto[]): Promise<R> {
    const res = await this.prisma.createMany<codeGenColumnDto>('sys_code_gen_column', dtos);
    return R.ok(res);
  }

  async updCodeGenColumn(dto: codeGenColumnUpdOneDto): Promise<R> {
    const res = await this.prisma.updateById<codeGenColumnDto>('sys_code_gen_column', dto);
    return R.ok(res);
  }

  async updCodeGenColumns(dtos: codeGenColumnUpdOneDto[]): Promise<R> {
    const res = await this.prisma.updateMany<codeGenColumnDto>('sys_code_gen_column', dtos);
    return R.ok(res);
  }

  async delCodeGenColumn(ids: number[]): Promise<R> {
    const res = await this.prisma.deleteById<codeGenColumnDto>('sys_code_gen_column', ids);
    return R.ok(res);
  }
}

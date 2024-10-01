import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { R } from '../../../../common/R';
import { codeGenTableDto, codeGenTableSelListDto, codeGenTableSelAllDto, codeGenTableInsOneDto, codeGenTableUpdOneDto } from './dto';

@Injectable()
export class CodeGenTableService {
  constructor(private readonly prisma: PrismaService) {
  }

  async selCodeGenTable(dto: codeGenTableSelListDto): Promise<R> {
    const res = await this.prisma.findPage<codeGenTableDto, codeGenTableSelListDto>('sys_code_gen_table', {
      data: dto,
      orderBy: true,
      notNullKeys: ['tableName', 'tableDescr', 'entityName', 'businessName', 'moduleName', 'orderNum'],
      numberKeys: ['orderNum'],
    });
    return R.ok(res);
  }

  async selAllCodeGenTable(dto: codeGenTableSelAllDto): Promise<R> {
    const res = await this.prisma.findAll<codeGenTableDto>('sys_code_gen_table', {
      data: dto,
      orderBy: true,
      notNullKeys: ['tableName', 'tableDescr', 'entityName', 'businessName', 'moduleName', 'orderNum'],
      numberKeys: ['orderNum'],
    });
    return R.ok(res);
  }

  async selOnesCodeGenTable(ids: number[]): Promise<R> {
    const res = await this.prisma.findByIds<codeGenTableDto>('sys_code_gen_table', Object.values(ids).map(n => Number(n)));
    return R.ok(res);
  }

  async selOneCodeGenTable(id: number): Promise<R> {
    const res = await this.prisma.findById<codeGenTableDto>('sys_code_gen_table', Number(id));
    return R.ok(res);
  }

  async insCodeGenTable(dto: codeGenTableInsOneDto): Promise<R> {
    const res = await this.prisma.create<codeGenTableDto>('sys_code_gen_table', dto);
    return R.ok(res);
  }

  async insCodeGenTables(dtos: codeGenTableInsOneDto[]): Promise<R> {
    const res = await this.prisma.createMany<codeGenTableDto>('sys_code_gen_table', dtos);
    return R.ok(res);
  }

  async updCodeGenTable(dto: codeGenTableUpdOneDto): Promise<R> {
    const res = await this.prisma.updateById<codeGenTableDto>('sys_code_gen_table', dto);
    return R.ok(res);
  }

  async updCodeGenTables(dtos: codeGenTableUpdOneDto[]): Promise<R> {
    const res = await this.prisma.updateMany<codeGenTableDto>('sys_code_gen_table', dtos);
    return R.ok(res);
  }

  async delCodeGenTable(ids: number[]): Promise<R> {
    const res = await this.prisma.deleteById<codeGenTableDto>('sys_code_gen_table', ids);
    return R.ok(res);
  }
}

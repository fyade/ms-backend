import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { R } from '../../../common/R';
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

  async selAll(dto: codeGenTableSelAllDto): Promise<R> {
    const res = await this.prisma.findAll('sys_code_gen_table', {
      data: dto,
      orderBy: true,
      notNullKeys: ['tableName', 'tableDescr', 'entityName', 'businessName', 'moduleName', 'orderNum'],
      numberKeys: ['orderNum'],
    });
    return R.ok(res);
  }

  async selOnes(ids: any[]): Promise<R> {
    const res = await this.prisma.findByIds('sys_code_gen_table', Object.values(ids).map(n => Number(n)));
    return R.ok(res);
  }

  async selOne(id: number): Promise<R> {
    const res = await this.prisma.findById('sys_code_gen_table', Number(id));
    return R.ok(res);
  }

  async insCodeGenTable(dto: codeGenTableInsOneDto): Promise<R> {
    const res = await this.prisma.create('sys_code_gen_table', dto);
    return R.ok(res);
  }

  async insCodeGenTables(dtos: codeGenTableInsOneDto[]): Promise<R> {
    const res = await this.prisma.createMany('sys_code_gen_table', dtos);
    return R.ok(res);
  }

  async updCodeGenTable(dto: codeGenTableUpdOneDto): Promise<R> {
    const res = await this.prisma.updateById('sys_code_gen_table', dto);
    return R.ok(res);
  }

  async updCodeGenTables(dtos: codeGenTableUpdOneDto[]): Promise<R> {
    const res = await this.prisma.updateMany('sys_code_gen_table', dtos);
    return R.ok(res);
  }

  async delCodeGenTable(ids: any[]): Promise<R> {
    const res = await this.prisma.deleteById('sys_code_gen_table', ids);
    return R.ok(res);
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { codeGenTableDto, insOneDto, selAllDto, selListDto, updOneDto } from './dto';
import { R } from '../../../common/R';

@Injectable()
export class CodeGenTableService {
  constructor(private readonly prisma: PrismaService) {
  }

  async selCodeGenTable(dto: selListDto): Promise<R> {
    const res = await this.prisma.findPage<codeGenTableDto, selListDto>('sys_code_gen_table', {
      data: dto,
      orderBy: true,
      notNullKeys: ['tableName', 'tableDescr', 'entityName', 'moduleName', 'businessName', 'orderNum'],
    });
    return R.ok(res);
  }

  async selAll(dto: selAllDto): Promise<R> {
    const res = await this.prisma.findAll('sys_code_gen_table', dto);
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

  async insCodeGenTable(dto: insOneDto): Promise<R> {
    const res = await this.prisma.create('sys_code_gen_table', dto);
    return R.ok(res);
  }

  async insCodeGenTables(dtos: insOneDto[]): Promise<R> {
    const res = await this.prisma.createMany('sys_code_gen_table', dtos);
    return R.ok(res);
  }

  async updCodeGenTable(dto: updOneDto): Promise<R> {
    const res = await this.prisma.updateById('sys_code_gen_table', dto);
    return R.ok(res);
  }

  async updCodeGenTables(dtos: updOneDto[]): Promise<R> {
    const res = await this.prisma.updateMany('sys_code_gen_table', dtos);
    return R.ok(res);
  }

  async delCodeGenTable(ids: any[]): Promise<R> {
    const res = await this.prisma.deleteById('sys_code_gen_table', ids);
    return R.ok(res);
  }
}

import { Controller, Get, Param, UsePipes } from '@nestjs/common';
import { CodeGenerationService } from './code-generation.service';
import { Authorize } from '../../../decorator/authorizeDecorator';
import { R } from '../../../common/R';
import { ApiTags } from '@nestjs/swagger';
import { ValidationPipe } from '../../../pipe/validation/validation.pipe';

@Controller('/sys-util/code-generation')
@ApiTags('代码生成')
@UsePipes(new ValidationPipe())
export class CodeGenerationController {
  constructor(private readonly codeGenerationService: CodeGenerationService) {
  }

  @Get()
  @Authorize('sysUtil:codeGeneration:get')
  async getDatabaseInfo(): Promise<R> {
    return this.codeGenerationService.getDatabaseInfo();
  }

  @Get('/c/:id')
  @Authorize('sysUtil:codeGeneration:getCode')
  async genCode(@Param('id') id: number): Promise<R> {
    return this.codeGenerationService.genCode(id);
  }

  @Get('/z/:id')
  @Authorize('sysUtil:codeGeneration:getCodeZip')
  async genCodeZip(@Param('id') id: number): Promise<R> {
    return this.codeGenerationService.genCodeZip(id);
  }
}

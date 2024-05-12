import { Controller, Get } from '@nestjs/common';
import { CodeGenerationService } from './code-generation.service';
import { Authorize } from '../../../decorator/authorizeDecorator';
import { R } from '../../../common/R';
import { ApiTags } from '@nestjs/swagger';

@Controller('/sys-util/code-generation')
@ApiTags("代码生成")
export class CodeGenerationController {
  constructor(private readonly codeGenerationService: CodeGenerationService) {
  }

  @Get()
  @Authorize('sysUtil:codeGeneration:get')
  async getDatabaseInfo(): Promise<R> {
    return this.codeGenerationService.getDatabaseInfo();
  }
}

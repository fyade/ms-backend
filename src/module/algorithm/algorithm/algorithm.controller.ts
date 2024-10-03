import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ValidationPipe } from '../../../pipe/validation/validation.pipe';
import { AlgorithmService } from './algorithm.service';
import { Authorize } from '../../../decorator/authorizeDecorator';
import { R } from '../../../common/R';
import { algorithmDto } from './dto';

@Controller('/algorithm/algorithm')
@ApiTags('算法系统/算法接口')
@ApiBearerAuth()
@UsePipes(new ValidationPipe())
export class AlgorithmController {
  constructor(private readonly algorithmService: AlgorithmService) {
  }

  @Post()
  @ApiOperation({
    summary: '算法接口',
  })
  @Authorize({
    permission: '',
    label: '算法',
    ifSF: true,
  })
  async algorithm(@Body() dto: algorithmDto): Promise<R> {
    return this.algorithmService.algorithm(dto);
  }
}

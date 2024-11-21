import { Global, Module } from '@nestjs/common';
import { BaseContextService } from './base-context.service';

@Global()
@Module({
  providers: [BaseContextService],
  exports: [BaseContextService],
})
export class BaseContextModule {
}

import { Global, Module } from '@nestjs/common';
import { BaseContextService } from './base-context.service';
import { createRequestScope } from './baseContext';

@Global()
@Module({
  providers: [BaseContextService, createRequestScope()],
  exports: [BaseContextService],
})
export class BaseContextModule {
}
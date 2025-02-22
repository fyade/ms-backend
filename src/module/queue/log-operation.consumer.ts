import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Job } from "bullmq";
import { AuthService } from "../auth/auth.service";
import { LogOperationQueueJobDataDto } from "./dto";
import { Injectable } from "@nestjs/common";

@Processor('log-operation-queue')
@Injectable()
export class LogOperationConsumer extends WorkerHost {
  constructor(
    private readonly authService: AuthService
  ) {
    super();
  }

  async process(job: Job<LogOperationQueueJobDataDto>): Promise<any> {
    const data = job.data;
    await this.authService.insLogOperation2(data.permission, data.request, data.ifSuccess, {
      ifIgnoreParamInLog: data.ifIgnoreParamInLog,
      reqBody: data.reqBody,
      reqQuery: data.reqQuery,
      reqMethod: data.reqMethod,
      reqId: data.reqId,
      userId: data.userId,
      loginRole: data.loginRole,
    })
    return Promise.resolve(void 0);
  }
}

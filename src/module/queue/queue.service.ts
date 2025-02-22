import { Injectable } from "@nestjs/common";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";
import { LogOperationQueueJobDataDto } from "./dto";

@Injectable()
export class QueueService {
  constructor(
    @InjectQueue('log-operation-queue') private readonly queue: Queue,
  ) {
  }

  async addLogOperationQueue(name: string, data: LogOperationQueueJobDataDto) {
    await this.queue.add(name, data)
  }
}

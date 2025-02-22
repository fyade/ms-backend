import { Injectable } from "@nestjs/common";
import { InjectQueue } from "@nestjs/bullmq";
import { Job, Queue } from "bullmq";
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

  async checkLogOperationQueue() {
    const jobs: Job<LogOperationQueueJobDataDto>[] = await this.queue.getFailed();
    for (const job of jobs) {
      if (job.data.permission === '-') {
        await this.queue.remove(job.id)
      }
    }
  }
}

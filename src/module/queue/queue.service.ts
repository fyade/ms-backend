import { Injectable } from "@nestjs/common";
import { InjectQueue } from "@nestjs/bullmq";
import { Job, Queue } from "bullmq";
import { LogOperationQueueJobDataDto } from "./dto";
import { ScheduleService } from "../schedule/schedule.service";
import { time } from "../../util/TimeUtils";

@Injectable()
export class QueueService {
  constructor(
    @InjectQueue('log-operation-queue') private readonly queue: Queue,
    private readonly scheduleService: ScheduleService,
  ) {
    this.scheduleService.addScheduleFunc('sys:queue:checkLogOperationQueue', this.checkLogOperationQueue.bind(this))
  }

  async addLogOperationQueue(name: string, data: LogOperationQueueJobDataDto) {
    await this.queue.add(name, data)
  }

  private async checkLogOperationQueue() {
    const jobs: Job<LogOperationQueueJobDataDto>[] = await this.queue.getFailed();
    for (const job of jobs) {
      if (job.data.permission === '-') {
        await this.queue.remove(job.id)
      }
    }
  }
}

import { Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { QueueService } from "../queue/queue.service";

@Injectable()
export class ScheduleService {
  constructor(
    private readonly queueService: QueueService
  ) {
  }

  @Cron('0 0 3 * * *')
  async scheduleEveryDay() {
    await this.queueService.checkLogOperationQueue()
  }
}

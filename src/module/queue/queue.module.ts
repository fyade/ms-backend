import { Global, Module } from "@nestjs/common";
import { QueueService } from "./queue.service";
import { BullModule } from "@nestjs/bullmq";
import { LogOperationConsumer } from "./log-operation.consumer";
import { currentEnv } from "../../../config/config";

const redisConfig = currentEnv().redis;

@Global()
@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: redisConfig.host,
        port: redisConfig.port,
        password: redisConfig.password,
        db: redisConfig.databaseForQueue,
      },
      defaultJobOptions: {
        removeOnComplete: true
      }
    }),
    BullModule.registerQueue({
      name: 'log-operation-queue'
    }),
  ],
  providers: [QueueService, LogOperationConsumer],
  exports: [QueueService]
})
export class QueueModule {
}

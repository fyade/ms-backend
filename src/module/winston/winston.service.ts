import { Injectable, LoggerService } from "@nestjs/common";
import * as winston from "winston";
import { currentEnv } from "../../../config/config";

@Injectable()
export class WinstonService implements LoggerService {
  private logger: winston.Logger

  constructor() {
    this.logger = winston.createLogger({
      levels: winston.config.syslog.levels,
      transports: [
        new winston.transports.File({
          level: 'error',
          dirname: currentEnv().log.logSavePath+'/errors/',
          filename:  'error.log',
          maxsize: currentEnv().log.maxSizeOfKogFile,
          format: winston.format.combine(
            winston.format.printf(info => `[${info.level.padEnd(15)}]: ${info.message}`)
          ),
        })
      ],
      exitOnError: false,
    })
  }

  log(message: any, ...optionalParams: any[]) {
    this.logger.info(message, ...optionalParams);
  }

  error(message: any, ...optionalParams: any[]) {
    this.logger.error(message, ...optionalParams);
  }

  warn(message: any, ...optionalParams: any[]) {
    this.logger.warn(message, ...optionalParams);
  }

  debug?(message: any, ...optionalParams: any[]) {
    this.logger.debug(message, ...optionalParams);
  }

  verbose?(message: any, ...optionalParams: any[]) {
    this.logger.verbose(message, ...optionalParams);
  }
}

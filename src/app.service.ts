import { Injectable } from '@nestjs/common';
import { R } from "./common/R";
import * as os from "os";
import { sleep } from "./util/BaseUtils";
import * as process from "process";
import * as diskinfo from 'diskinfo'

@Injectable()
export class AppService {
  private cpuUsageMSDefault: number;

  constructor() {
    this.cpuUsageMSDefault = 100; // CPU 利用率默认时间段
  }

  async getHello(): Promise<R> {
    return R.ok('Hello World!')
  }

  async getBaseInfo(): Promise<R> {
    const cpuUsage = await this.getCPUUsage();
    const memoryInfo = this.getMemoryInfo();
    const diskInfo = await this.getDiskInfo();
    return R.ok({
      cpu: cpuUsage,
      memory: memoryInfo,
      disk: diskInfo
    })
  }

  /**
   * 获取CPU信息
   */
  async getCPUUsage() {
    const t1 = this._getCPUInfo()
    await sleep(this.cpuUsageMSDefault)
    const t2 = this._getCPUInfo()
    const idle = t2.idle - t1.idle
    const total = t2.total - t1.total
    const usage = 1 - idle / total
    const cpus = os.cpus();
    return {
      coreNum: cpus.length,
      core: cpus[0].model.trim(),
      usage
    }
  }

  _getCPUInfo() {
    const cpus = os.cpus();
    let user = 0, nice = 0, sys = 0, idle = 0, irq = 0, total = 0
    for (const cpu in cpus) {
      const times = cpus[cpu].times
      user += times.user
      nice += times.user
      sys += times.sys
      idle += times.idle
      irq += times.irq
    }
    total += user + nice + sys + idle + irq
    return {
      user,
      sys,
      idle,
      total
    }
  }

  /**
   * 获取内存信息
   */
  getMemoryInfo() {
    const totalmem = os.totalmem(); // 系统总内存
    const freemem = os.freemem(); // 系统空闲内存
    const {rss, heapUsed, heapTotal} = process.memoryUsage(); // 当前Node进程内存情况
    return {
      system: 1 - freemem / totalmem, // 系统内存占用
      heap: heapUsed / heapTotal, // Node内存占用
      node: rss / totalmem, // Node内存占用（相对于系统
      total: totalmem,
      free: freemem,
      used: totalmem - freemem
    }
  }

  /**
   * 获取磁盘信息
   */
  getDiskInfo() {
    const retArr = []
    return new Promise((resolve) => {
      diskinfo.getDrives((err, aDrives) => {
        const index1 = aDrives.findIndex((item, index) => item.mounted === aDrives[0].mounted && index !== 0);
        const aDrives_ = index1 === -1 ? aDrives : aDrives.slice(0, index1)
        for (let i = 0; i < aDrives_.length; i++) {
          const item = aDrives_[i]
          retArr.push({
            mounted: item.mounted,
            total: item.blocks,
            used: item.used,
            available: item.available,
            capacity: item.capacity
          })
        }
        resolve(retArr)
      })
    })
  }
}

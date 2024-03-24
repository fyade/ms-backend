import { Injectable } from '@nestjs/common';
import { PrismaService } from "../../../prisma/prisma.service";
import { R } from "../../../common/R";
import { currentEnv } from "../../../config/config";
import { join } from 'path';
import * as fs from "fs";
import { base } from "../../../util/base";
import {
  params_fileUploadOneChunk_check,
  params_fileUploadOneChunk_merge,
  params_fileUploadOneChunk_upload,
  selListDto
} from "./dto";
import { pageVo } from "../../../common/vo/PageVo";
import { pageSelDto } from "../../../common/dto/PageDto";
import { randomUUID } from "../../../util/IdUtils";

const SparkMD5 = require('spark-md5')

@Injectable()
export class FileUploadService {
  private env: any;

  constructor(private readonly prisma: PrismaService) {
    this.env = currentEnv()
  }

  async selList(dto: selListDto): Promise<R> {
    dto.pageNum = Number(dto.pageNum)
    dto.pageSize = Number(dto.pageSize)
    const filter = {
      skip: (dto.pageNum - 1) * dto.pageSize,
      take: dto.pageSize,
      where: {
        deleted: base.N
      },
      orderBy: {
        create_time: 'desc'
      }
    }
    if (dto.filterSame === base.Y) {
      filter.where['if_first'] = base.Y
    }
    const data = await this.prisma.tbl_file.findMany(filter)
    data.forEach(item => {
      for (const key in item) {
        if (typeof item[key] === 'bigint') {
          item[key] = item[key].toString()
        }
      }
    })
    for (let i = 0; i < data.length; i++) {
      if (data[i].if_chunk === base.Y && data[i].if_merge === base.N) {
        const count = await this.prisma.tbl_file_chunk.count({
          where: {
            file_md5: data[i].file_md5,
            if_finished: base.Y,
            deleted: base.N
          }
        });
        data[i]['uploadedCount'] = count
      }
    }
    const total = dto.filterSame === base.Y ? await this.prisma.tbl_file.count({
      where: {
        if_first: base.Y,
        deleted: base.N
      }
    }) : await this.prisma.tbl_file.count()
    const retObj: pageVo = {
      pageNum: dto.pageNum,
      pageSize: dto.pageSize,
      total: total,
      list: data,
      ifFirst: dto.pageNum === 1,
      ifLast: dto.pageNum === Math.ceil(total / dto.pageSize)
    }
    return R.ok(retObj)
  }

  async fileUploadOneFull(file, filename?: string): Promise<R> {
    try {
      const fileName = filename || file.originalname
      const fileMd5 = SparkMD5.hash(file.buffer);
      // 如果已有相同文件，则不用上传了
      const sameFile = await this.prisma.tbl_file.findFirst({
        where: {
          file_name: fileName,
          file_md5: fileMd5,
          if_chunk: base.N,
          if_finished: base.Y,
          deleted: base.N
        }
      });
      const fileSize = file.size
      const fileSuffix = fileName.substring(fileName.lastIndexOf("."))
      const fileUUID = randomUUID();
      const fileNewName = fileUUID + fileSuffix;
      const filePath = join(this.env.file.fileUploadPath, fileNewName);
      const fillObj = {
        file_name: fileName,
        file_new_name: fileNewName,
        file_size: BigInt(fileSize),
        file_md5: fileMd5,
        if_chunk: base.N,
        if_first: base.Y,
        if_finished: base.N,
        create_by: 'admin',
        update_by: 'admin',
      }
      if (sameFile) {
        // 如果已有相同文件，直接存库
        fillObj.file_new_name = sameFile.file_new_name
        fillObj.file_size = BigInt(sameFile.file_size)
        fillObj.if_first = base.N
        fillObj.if_finished = base.Y
        fillObj.create_by = 'admin'
        await this.prisma.tbl_file.create({
          data: fillObj
        });
      } else {
        // 如果无相同文件，先存下库，if_finished字段设为false，然后存文件，最后更新库
        const newVar = await this.prisma.tbl_file.create({
          data: fillObj
        });
        fs.writeFileSync(filePath, file.buffer)
        await this.prisma.tbl_file.update({
          where: {
            id: newVar.id,
            deleted: base.N
          },
          data: {
            if_finished: base.Y
          }
        });
      }
      return R.ok(fillObj.file_new_name)
    } catch (e) {
      return R.err(e.message)
    }
  }

  async fileUploadOneChunkCheck(dto: params_fileUploadOneChunk_check): Promise<R> {
    const fileName = dto.fileName
    const fileSuffix = fileName.substring(fileName.lastIndexOf("."))
    const fileUUID = randomUUID();
    const fileNewName = fileUUID + fileSuffix;
    const sameFile = await this.prisma.tbl_file.findMany({
      where: {
        file_name: dto.fileName,
        file_md5: dto.fileMd5,
        if_chunk: base.Y,
        deleted: base.N
      }
    });
    if (sameFile.length > 0) {
      // 已存在
      // 是否合并
      let b = true
      for (const sameFileElement of sameFile) {
        if (sameFileElement.if_merge === base.N) {
          b = false
        }
      }
      const sameFileElement1 = sameFile[0];
      if (b) {
        // 已合并
        // 保存文件信息至数据库
        const fillObj = {
          file_name: sameFileElement1.file_name,
          file_new_name: sameFileElement1.file_new_name,
          file_size: BigInt(sameFileElement1.file_size),
          file_md5: sameFileElement1.file_md5,
          if_chunk: base.Y,
          chunk_num: sameFileElement1.chunk_num,
          if_first: base.N,
          if_merge: base.Y,
          if_finished: base.Y,
          create_by: 'admin',
          update_by: 'admin',
        }
        await this.prisma.tbl_file.create({
          data: fillObj
        })
        return R.ok({merge: true})
      } else {
        // 未合并
        // 保存文件信息至数据库
        const fillObj = {
          file_name: sameFileElement1.file_name,
          file_new_name: sameFileElement1.file_new_name,
          file_size: BigInt(sameFileElement1.file_size),
          file_md5: sameFileElement1.file_md5,
          if_chunk: base.Y,
          chunk_num: sameFileElement1.chunk_num,
          if_first: base.N,
          if_merge: base.N,
          if_finished: base.N,
          create_by: 'admin',
          update_by: 'admin',
        }
        await this.prisma.tbl_file.create({
          data: fillObj
        });
        const findMany = await this.prisma.tbl_file_chunk.findMany({
          where: {
            file_new_name: sameFileElement1.file_new_name,
            file_md5: dto.fileMd5,
            if_finished: base.Y,
            deleted: base.N
          }
        });
        return R.ok({
          merge: false,
          count: findMany.length,
          fileNewName: sameFileElement1.file_new_name,
          uploadedIndexs: findMany.map(item => item.chunk_index)
        })
      }
    } else {
      // 不存在，保存文件信息至数据库
      const fillObj = {
        file_name: fileName,
        file_new_name: fileNewName,
        file_size: BigInt(dto.fileSize),
        file_md5: dto.fileMd5,
        if_chunk: base.Y,
        chunk_num: dto.chunkNum,
        if_first: base.Y,
        if_merge: base.N,
        if_finished: base.N,
        create_by: 'admin',
        update_by: 'admin',
      }
      await this.prisma.tbl_file.create({
        data: fillObj
      })
      return R.ok({
        merge: false,
        count: 0,
        fileNewName: fileNewName,
        uploadedIndexs: []
      })
    }
  }

  async fileUploadOneChunkUpload(dto: params_fileUploadOneChunk_upload): Promise<R> {
    dto.chunkIndex = Number(dto.chunkIndex)
    try {
      const chunkName = randomUUID();
      // 保存文件信息至数据库
      const info = await this.prisma.tbl_file_chunk.create({
        data: {
          file_md5: dto.fileMd5,
          file_new_name: dto.fileNewName,
          chunk_name: chunkName,
          chunk_index: dto.chunkIndex,
          if_finished: base.N,
          create_by: 'admin'
        }
      });
      // 保存文件
      const filePath = join(this.env.file.fileChunkPath, chunkName);
      fs.writeFileSync(filePath, dto.file.buffer)
      // 更新文件信息
      await this.prisma.tbl_file_chunk.update({
        where: {
          id: info.id,
          deleted: base.N
        },
        data: {
          if_finished: base.Y
        }
      })
      return R.ok()
    } catch (e) {
      return R.err(e.message)
    }
  }

  async fileUploadOneChunkMerge(dto: params_fileUploadOneChunk_merge): Promise<R> {
    const fileInfos = await this.prisma.tbl_file.findMany({
      where: {
        file_new_name: dto.fileNewName,
        file_md5: dto.fileMd5,
        deleted: base.N
      }
    })
    const fileInfo = fileInfos[0]
    const chunks = await this.prisma.tbl_file_chunk.findMany({
      where: {
        file_new_name: fileInfo.file_new_name,
        file_md5: fileInfo.file_md5,
        deleted: base.N
      },
      orderBy: {
        chunk_index: 'asc'
      }
    });
    if (chunks.length !== fileInfo.chunk_num) {
      return R.err('合并失败，请重试。')
    }
    const outputFile = join(this.env.file.fileUploadPath, fileInfo.file_new_name)
    const outputFd = fs.openSync(outputFile, 'w');
    // 创建一个 Promise 数组，每个 Promise 处理一个文件块的写入
    const promises = chunks.map((chunk) => {
      const file = join(this.env.file.fileChunkPath, chunk.chunk_name);
      const inputFd = fs.openSync(file, 'r');
      const buffer = Buffer.alloc(4096); // 4KB 缓冲区，你可以根据实际情况调整大小
      function write() {
        const bytesRead = fs.readSync(inputFd, buffer, 0, buffer.length, null);
        if (bytesRead > 0) {
          fs.writeSync(outputFd, buffer, 0, bytesRead, null);
          write();
        }
      }

      return new Promise((resolve, reject) => {
        write();
        fs.closeSync(inputFd);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        resolve();
      });
    });
    // 使用 Promise.all 等待所有写入操作完成
    Promise.all(promises)
      .then(() => {
        fs.closeSync(outputFd);
      })
      .catch((error) => {
        console.error('Error while processing file chunks:', error);
      });
    for (let i = 0; i < fileInfos.length; i++) {
      try {
        await this.prisma.tbl_file.update({
          where: {
            id: fileInfos[i].id,
            if_merge: base.N,
            if_finished: base.N,
            deleted: base.N
          },
          data: {
            if_merge: base.Y,
            if_finished: base.Y
          }
        })
      } catch (e) {
      }
    }
    return R.ok()
  }

  async getImageWaterfallFlow(dto: pageSelDto) {
    return this.prisma.tbl_file.findMany({
      skip: (Number(dto.pageNum) - 1) * Number(dto.pageSize),
      take: Number(dto.pageSize),
      where: {
        file_name: {
          endsWith: ['.jpg', '.jpeg', '.png']
        },
        deleted: base.N,
        if_first: base.Y
      },
      orderBy: {
        create_time: 'asc'
      }
    })
  }
}

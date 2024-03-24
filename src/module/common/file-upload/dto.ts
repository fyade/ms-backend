import { pageSelDto } from "../../../common/dto/PageDto";

export interface selListDto extends pageSelDto {
  filterSame: string
}

export interface params_fileUploadOneChunk_check {
  fileName: string
  fileMd5: string
  fileSize: number
  chunkNum: number
}

export interface params_fileUploadOneChunk_upload {
  fileMd5: string
  fileNewName: string
  chunkIndex: number
  file: any
}

export interface params_fileUploadOneChunk_merge {
  fileNewName: string
  fileMd5: string
}

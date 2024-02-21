export interface sendDto0 {
  msg: string
}

export interface sendDto1 {
  from: string
  to: string
  params: equipName
  remark: string
}

interface equipName {
  name: string
  power: string
}

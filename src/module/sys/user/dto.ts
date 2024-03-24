export interface reqUser {
  userid: string
  username: string
}

export interface userDto extends loginDto {
  id: string
}

export interface userDto2 extends loginDto {
  userid: string
}

export interface loginDto {
  username: string
  password: string
}

export interface registDto extends loginDto {
}
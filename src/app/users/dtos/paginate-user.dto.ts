import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { UserDto } from './user.dto';

export class PaginateUserDto {
  @ApiProperty({ type: [UserDto] })
  @Type(() => UserDto)
  data: UserDto[];

  @ApiProperty()
  search?: string;

  @ApiProperty()
  type?: string;

  @ApiProperty()
  sort?: string;

  @ApiProperty()
  page: number;

  @ApiProperty()
  perPage: number;

  @ApiProperty()
  total: number;
}

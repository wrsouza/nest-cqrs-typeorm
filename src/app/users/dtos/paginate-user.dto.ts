import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { UserDto } from './user.dto';

export class PaginateUserDto {
  @ApiProperty({ type: [UserDto] })
  @Expose()
  @Type(() => UserDto)
  data: UserDto[];

  @ApiProperty()
  @Expose()
  search?: string;

  @ApiProperty()
  @Expose()
  type?: string;

  @ApiProperty()
  @Expose()
  sort?: string;

  @ApiProperty()
  @Expose()
  @Type(() => Number)
  page: number;

  @ApiProperty()
  @Expose()
  @Type(() => Number)
  perPage: number;

  @ApiProperty()
  @Expose()
  @Type(() => Number)
  total: number;
}

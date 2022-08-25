import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { UniqueEmail } from '../validations';
import { BaseRequest } from './base.request';
import { ApiProperty } from '@nestjs/swagger';

export class UserCreateRequest extends BaseRequest {
  @ApiProperty()
  @IsString()
  @MinLength(3)
  name: string;

  @ApiProperty()
  @IsEmail()
  @UniqueEmail()
  email: string;

  @ApiProperty()
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  password: string;
}

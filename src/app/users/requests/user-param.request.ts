import { IsString, IsUUID } from 'class-validator';
import { UserExists } from '../validations/user-exists.validation';
import { ApiProperty } from '@nestjs/swagger';

export class UserParamRequest {
  @ApiProperty()
  @IsString()
  @IsUUID()
  @UserExists()
  id: string;
}

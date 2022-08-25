import { PartialType } from '@nestjs/swagger';
import { UserCreateRequest } from './user-create.request';

export class UserUpdateRequest extends PartialType(UserCreateRequest) {}

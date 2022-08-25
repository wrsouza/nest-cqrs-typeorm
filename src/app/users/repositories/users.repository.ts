import { UserEntity } from '../entities';
import { CustomRepository } from '../../../infra/database/typeorm/typeorm-ex.decorator';
import { BaseRepository } from '../../../infra/database/typeorm/repositories/base.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
@CustomRepository(UserEntity)
export class UsersRepository extends BaseRepository<UserEntity> {}

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  UserCreateCommand,
  UserDestroyCommand,
  UserUpdateCommand,
} from './commands';
import { UserShowQuery, UserPaginateQuery } from './queries';
import {
  UserCreateRequest,
  UserPaginateRequest,
  UserUpdateRequest,
  UserParamRequest,
} from './requests';
import { PaginateUserDto, UserDto } from './dtos';

@ApiTags('users')
@Controller('/users')
export class UsersController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  @ApiOperation({ summary: 'User Paginate' })
  @ApiResponse({
    status: 200,
    type: PaginateUserDto,
  })
  async index(
    @Query() userPaginate: UserPaginateRequest,
  ): Promise<PaginateUserDto> {
    return this.queryBus.execute(new UserPaginateQuery(userPaginate));
  }

  @Post()
  @ApiOperation({ summary: 'Create New User' })
  @ApiResponse({
    status: 201,
    type: UserDto,
  })
  @HttpCode(201)
  async store(@Body() userCreate: UserCreateRequest): Promise<UserDto> {
    return this.commandBus.execute(new UserCreateCommand(userCreate));
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Show User' })
  @ApiResponse({
    status: 200,
    type: UserDto,
  })
  @HttpCode(200)
  async show(@Param() { id }: UserParamRequest): Promise<UserDto> {
    return this.queryBus.execute(new UserShowQuery(id));
  }

  @Put('/:id')
  @ApiOperation({ summary: 'Update User' })
  @ApiResponse({
    status: 200,
    type: UserDto,
  })
  @HttpCode(200)
  async update(
    @Param() { id }: UserParamRequest,
    @Body() userUpdate: UserUpdateRequest,
  ): Promise<UserDto> {
    return this.commandBus.execute(new UserUpdateCommand(id, userUpdate));
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Delete User' })
  @ApiResponse({ status: 204 })
  @HttpCode(204)
  async destroy(@Param() { id }: UserParamRequest): Promise<void> {
    await this.commandBus.execute(new UserDestroyCommand(id));
  }
}

import {
  FindOneOptions,
  FindOptionsOrder,
  FindOptionsSelect,
  ILike,
  Repository,
} from 'typeorm';
import { PaginateDto } from '../dtos/paginate.dto';
import { PaginateRequest } from '../requests/paginate.request';

export abstract class BaseRepository<T> extends Repository<T> {
  async paginate(
    paginateDto: PaginateRequest,
    select: FindOptionsSelect<T> = {},
    relations: string[] = [],
  ): Promise<PaginateDto<T>> {
    const { page, perPage, search, type, sort } = paginateDto;

    const take = perPage || 15;
    const skip = ((page || 1) - 1) * take;
    const order = sort
      ? sort.charAt(0) === '-'
        ? sort.substring(1)
        : sort
      : 'id';
    const direction = sort ? (sort.charAt(0) === '-' ? 'DESC' : 'ASC') : 'DESC';

    let where = {};
    if (search && type) {
      where = {
        [type]: ILike(`%${search}%`),
      };
    }

    const [result, total] = await this.findAndCount({
      select,
      where,
      take,
      skip,
      order: {
        [order]: direction,
      } as FindOptionsOrder<T>,
      relations,
    } as FindOneOptions<T>);

    return {
      data: result,
      search,
      type,
      sort,
      page: page || 1,
      perPage: perPage || 15,
      total,
    };
  }
}

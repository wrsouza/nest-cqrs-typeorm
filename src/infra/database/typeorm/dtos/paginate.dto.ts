export class PaginateDto<T> {
  data: T[];
  search?: string;
  type?: string;
  sort?: string;
  page: number;
  perPage: number;
  total: number;
}

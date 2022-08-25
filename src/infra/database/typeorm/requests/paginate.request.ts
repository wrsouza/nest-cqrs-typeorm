import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class PaginateRequest {
  @IsOptional()
  @IsString()
  search: string;

  @IsOptional()
  @IsString()
  type: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page: number;

  @IsOptional()
  @IsString()
  sort: string;

  @IsOptional()
  @Type(() => Number)
  @Min(5)
  @Max(100)
  perPage: number;
}

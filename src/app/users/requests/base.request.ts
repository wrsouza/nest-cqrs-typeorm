import { Allow } from 'class-validator';

export class BaseRequest {
  @Allow()
  context?: {
    params: any;
    query: any;
    user: any;
  };
}

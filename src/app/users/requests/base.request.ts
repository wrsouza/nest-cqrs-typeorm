import { Allow } from 'class-validator';

export abstract class BaseRequest {
  @Allow()
  context?: {
    params: any;
    query: any;
    user: any;
  };
}

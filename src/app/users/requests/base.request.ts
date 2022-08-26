import { Allow } from 'class-validator';

export class BaseRequest {
  @Allow()
  context?: {
    params: {
      id?: string;
    };
    query: any;
    user: any;
  };
}

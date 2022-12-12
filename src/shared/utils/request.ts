import { request } from 'undici';

export abstract class Request {
  protected request: typeof request;

  constructor(protected url: string) {
    this.request = request;
  } 

  public abstract get<T>(endpoint: string): Promise<T>;
}


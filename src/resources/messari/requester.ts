import config from 'config';
import { Dispatcher, request } from 'undici';

import { MessariConfigProps } from '@/config/default';

import { Request } from '@/src/shared/utils/request';

const messariConfig: MessariConfigProps = config.get<
  MessariConfigProps
>('app.resources.messari');

export class MessariRequester extends Request {
  constructor() {
    super(messariConfig.apiURL);
  }

  public async get<T>(endpoint: string): Promise<T> {
    const res: Awaited<T> = await request(`${messariConfig.apiURL}/${endpoint}`, {
      method: 'GET',
      headers: {
        'x-messari-api-key': `${messariConfig.apiKey}`
      },
    }).then((r: Dispatcher.ResponseData): Promise<T> => r.body.json());

    return res;
  }
}
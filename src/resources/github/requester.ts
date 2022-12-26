import config from 'config';
import { Dispatcher } from 'undici';

import { GithubConfigProps } from '@/config/default';

import { Request } from '@/src/shared/utils/request';

const githubConfig: GithubConfigProps = config.get<
  GithubConfigProps
>('app.resources.github');

class GithubRequester extends Request {
  constructor() {
    super(githubConfig.api.url);
  }

  public async get<T>(endpoint: string): Promise<T> {
    const res: Awaited<T> = await this.request(`${this.url}/${endpoint}`, {
      method: 'GET',
      headers: {
        'user-agent': githubConfig.api.url
      }
    }).then((r: Dispatcher.ResponseData): Promise<T> => r.body.json());

    return res;
  }
}

export default new GithubRequester();
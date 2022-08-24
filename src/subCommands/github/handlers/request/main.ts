import { request } from 'undici'
import { ResponseData } from 'undici/types/dispatcher';

export const githubRequestHandler = async <T>(endpoint: string): Promise<T | null> => {
  const res: Awaited<T> = await request(`https://api.github.com/${endpoint}`, {
    method: 'GET',
    headers: {
      'user-agent': 'MiamiClient'
    }
  }).then((r: ResponseData): Promise<T> => r.body.json());

  return res ?? null;
}
import { request } from 'undici';
import { ResponseData } from 'undici/types/dispatcher';

export const messariRequest = async <T>(endpoint: string, queryParams?: Record<string, any>): Promise<T> => {
  const res: Awaited<T> = await request(`https://data.messari.io/api/${endpoint}`, {
    method: 'GET',
    headers: {
      'x-messari-api-key': `${process.env.MESSARI_API_KEY}`
    },
    query: queryParams
  }).then((r: ResponseData): Promise<T> => r.body.json());

  return res ?? null;
}

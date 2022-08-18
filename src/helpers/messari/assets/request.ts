import { request } from 'undici';
import { ResponseData } from 'undici/types/dispatcher';

import { MessariAssetMetrics } from '@types';

export const getAssetMetrics = async (assetKey: string): Promise<MessariAssetMetrics> => {
  const res: ResponseData = await request(`https://data.messari.io/api/v1/assets/${assetKey}/metrics`, {
    method: 'GET',
    headers: {
      'x-messari-api-key': `${process.env.MESSARI_API_KEY}`
    }
  });

  return res.statusCode === 404 ? null : res.body.json() as unknown as MessariAssetMetrics;
}
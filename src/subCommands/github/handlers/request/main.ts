import { request } from 'undici'
import { ResponseData } from 'undici/types/dispatcher';

/**
 * Perform a request to Github json api
 * 
 * @function
 * 
 * @param {String} endpoint - The github api endpoint to reach
 *  
 * @returns {Promise<T | null>} T - The output with the given typing
 */
export const githubRequestHandler = async <T>(endpoint: string): Promise<T | null> => {
  const res: Awaited<T> = await request(`https://api.github.com/${endpoint}`, {
    method: 'GET',
    headers: {
      'user-agent': 'MiamiClient'
    }
  }).then((r: ResponseData): Promise<T> => r.body.json());

  return res ?? null;
}
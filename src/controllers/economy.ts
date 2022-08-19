import { UserSchema } from '@shared/database/models/user';

import { formatMs } from '@shared/utils/functions/time';

type State = {
  status: boolean,
  time?: string
}

/**
 * Represents a Economy controller
 * 
 * @class
 * @classdesc Will handle transactions and everything related to the economy
 */
export class EconomyController {
  /**
   * Check if the user can receive daily bonus
   * 
   * @public @method
   * 
   * @param {Number} daily - The user daily time
   *  
   * @returns {State} state - The current daily state
   */
  dailyCheck(daily: number): State {
    const dailyInterval: number = 8.64e+7;
    const timeout: number = (Date.now() - daily);

    if (daily !== null && dailyInterval - timeout > 0) {
      let time: string = formatMs(dailyInterval - timeout);

      return {
        status: false,
        time
      }
    }

    return {
      status: true
    }
  }

  /**
   * Retrieve daily bonus
   * 
   * @public @method
   * 
   * @param {UserSchema} mongoUSER - The database user
   *  
   * @returns {Object} coins - The value received 
   */
  async dailyRetrieve(mongoUSER: UserSchema): Promise<{ coins: number }> {
    let coinsToReceive: number = 5000;

    if (mongoUSER.status.vip) coinsToReceive *= 2;

    mongoUSER.status.coins += coinsToReceive;
    mongoUSER.cooldowns.daily = Date.now();

    await mongoUSER.save();
    
    return {
      coins: coinsToReceive
    }
  }
}
import { UserSchema } from '@shared/database/models/user';

import { formatMs } from '@shared/utils/functions/time';

export class EconomyController {
  dailyCheck(daily: number): { status: boolean, time?: string } {
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
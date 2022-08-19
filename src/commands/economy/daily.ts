import { InteractionReplyOptions } from 'discord.js';

import { CommandBase, CommandContext, MiamiClient } from '@structures/index';

import { EconomyController } from '@controllers/economy';

import { UserSchema } from '@shared/database/models/user';

import { toCurrency } from '@shared/utils/functions/number';

/**
 * Represents a Daily slash command
 * 
 * @class @extends CommandBase
 * 
 * @prop {EconomyController} ecoController - The EconomyController instance
 * @prop {MiamiClient} client - The MiamiClient instance
 */
export default class DailyCommand extends CommandBase {
  private ecoController: EconomyController;

  client: MiamiClient;

  /**
   * @constructs DailyCommand
   * 
   * @param {MiamiClient} client - The MiamiClient instance 
   */
  constructor(client: MiamiClient) {
    super(client, {
      name: 'diaria',
      description: 'Receber bônus diário',
      category: 'Economy',
      requiresDatabase: true
    });

    this.client = client;
    this.ecoController = new EconomyController();
  }

  /**
   * Used to handle the incoming interaction
   * 
   * @public @method @async
   * 
   * @param {CommandContext} ctx - The command context  
   * 
   * @returns {InteractionReplyOptions} options - The given options for ctx
   */
  async run(ctx: CommandContext): Promise<InteractionReplyOptions> {
    const mongoUSER: UserSchema = await this.client.usersDb.findOne({ 
      userId: ctx.user.id, 
      guildId: ctx.guild.id 
    });

    const daily = this.ecoController.dailyCheck(mongoUSER.cooldowns.daily);

    if (!daily.status) {
      return ctx.reply({
        ephemeral: true,
        content: `Aguarde \`${daily.time}\` para coletar seu bônus novamente.`
      });
    }

    const { coins } = await this.ecoController.dailyRetrieve(mongoUSER);

    return ctx.reply({
      ephemeral: true,
      content: `Você recebeu \`${toCurrency(coins)}\` como bônus.`
    });
  }
}
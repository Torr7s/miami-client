import {
  APIInteractionDataResolvedChannel,
  APIInteractionGuildMember,
  APIRole,
  Channel,
  ChatInputCommandInteraction,
  Guild,
  GuildMember,
  GuildTextBasedChannel,
  InteractionReplyOptions,
  Role,
  User,
} from 'discord.js';

import MiamiClient from './client';

export default class CommandContext {
  private readonly client: MiamiClient;
  
  readonly interaction: ChatInputCommandInteraction;

  readonly resolvedUsers?: User[];
  readonly resolvedRoles?: (Role | APIRole)[];
  readonly resolvedChannels?: (Channel | APIInteractionDataResolvedChannel)[];

  constructor(client: MiamiClient, interaction: ChatInputCommandInteraction) {
    this.client = client;
    this.interaction = interaction;

    /* ... */

    if (interaction.options.resolved?.users) {
      this.resolvedUsers = interaction.options.resolved?.users?.map((user) => user);
    }

    if (interaction.options.resolved?.roles) {
      this.resolvedRoles = interaction.options.resolved?.roles?.map((role) => role);
    }

    if (interaction.options.resolved?.channels) {
      this.resolvedChannels = interaction.options.resolved?.channels?.map((channel) => channel);
    }
  }

  get channel(): GuildTextBasedChannel {
    return this.interaction.channel;
  }

  get guild(): Guild {
    return this.interaction.guild;
  }

  get member(): GuildMember | APIInteractionGuildMember {
    return this.interaction.member;
  }

  get user(): User {
    return this.interaction.user; 
  }

  public async reply(options: InteractionReplyOptions): Promise<InteractionReplyOptions> {
    if (!options.content) options.content = '';

    this.interaction.deferred ? await this.interaction.editReply(options) : await this.interaction.reply(options);

    return options;
  }
}
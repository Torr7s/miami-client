import {
  APIInteractionDataResolvedChannel,
  APIInteractionGuildMember,
  APIRole,
  CacheType,
  Channel,
  ChatInputCommandInteraction,
  CommandInteractionResolvedData,
  Guild,
  GuildMember,
  GuildTextBasedChannel,
  InteractionReplyOptions,
  Role,
  User,
} from 'discord.js';

import MiamiClient from './client';

type ResolvedUser = User;
type ResolvedRole = Role|APIRole;
type ResolvedChannel = Channel|APIInteractionDataResolvedChannel;

export default class CommandContext {
  private readonly client: MiamiClient;

  public readonly interaction: ChatInputCommandInteraction;

  public readonly resolvedUsers?: ResolvedUser[];
  public readonly resolvedRoles?: ResolvedRole[];
  public readonly resolvedChannels?: ResolvedChannel[];

  constructor(client: MiamiClient, interaction: ChatInputCommandInteraction) {
    this.client = client;
    this.interaction = interaction;

    const resolvedOptions: Readonly<CommandInteractionResolvedData<CacheType>> = interaction.options.resolved;

    if (resolvedOptions?.users) {
      this.resolvedUsers = resolvedOptions?.users?.map(
        (user: ResolvedUser): ResolvedUser =>
          user
      );
    }

    if (resolvedOptions?.roles) {
      this.resolvedRoles = resolvedOptions?.roles?.map(
        (role: ResolvedRole): ResolvedRole =>
          role
      );
    }

    if (resolvedOptions?.channels) {
      this.resolvedChannels = resolvedOptions?.channels?.map(
        (channel: ResolvedChannel): ResolvedChannel =>
          channel
      );
    }
  }

  get channel(): GuildTextBasedChannel {
    return this.interaction.channel;
  }

  get executor(): User {
    return this.interaction.user;
  }

  get guild(): Guild {
    return this.interaction.guild;
  }

  get member(): GuildMember|APIInteractionGuildMember {
    return this.interaction.member;
  }

  public async reply(options: InteractionReplyOptions): Promise<InteractionReplyOptions> {
    if (!options.content) options.content = '';

    this.interaction.deferred ? await this.interaction.editReply(options) : await this.interaction.reply(options);

    return options;
  }
}
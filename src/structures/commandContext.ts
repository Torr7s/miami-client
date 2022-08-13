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

import { MiamiClient } from './client';

/**
 * Represents a Command Context
 * 
 * @class
 * @classdesc Responsible for handle interactions and its options
 * 
 * @prop {ChatInputCommandInteraction} interaction - The handled interaction
 * @prop {Array<User>} resolvedUsers - The resolved users array of a command interaction
 * @prop {Array<Role | APIRole>} resolvedRoles - The resolved roles array of a command interaction
 * @prop {Array<Channel | APIInteractionDataResolvedChannel>} resolvedChannels - The resolved channels array of a command interaction 
*/
export class CommandContext {
  private readonly client: MiamiClient;
  
  readonly interaction: ChatInputCommandInteraction;

  readonly resolvedUsers?: User[];
  readonly resolvedRoles?: (Role | APIRole)[];
  readonly resolvedChannels?: (Channel | APIInteractionDataResolvedChannel)[];

  /**
   * Create a new CommandContext instance
   * 
   * @constructs CommandContext
   * 
   * @param {MiamiClient} client - A MiamiClient instance 
   * @param {ChatInputCommandInteraction} interaction - The interaction to be handled
   */
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

  /**
   * Get the channel where the interaction was performed
   * 
   * @public @method
   * 
   * @returns {GuildTextBasedChannel} channel - The present channel
   */
  get channel(): GuildTextBasedChannel {
    return this.interaction.channel;
  }

  /**
   * Get the guild where the interaction was performed
   * 
   * @public @method
   * 
   * @returns {Guild} guild - The present guild
   */
  get guild(): Guild {
    return this.interaction.guild;
  }

  /**
   * Get the member who performed the interaction
   * 
   * @public @method
   * 
   * @returns {GuildMember | APIInteractionGuildMember} member - The performer member
   */
  get member(): GuildMember | APIInteractionGuildMember {
    return this.interaction.member;
  }

  /**
   * Get the current user
   * 
   * @public @method
   * 
   * @returns {User} user - The current user
   */
  get user(): User {
    return this.interaction.user; 
  }

  /**
   * Reply to an interaction with its options
   * 
   * @public @async @method
   * 
   * @param {InteractionReplyOptions} options - The reply options
   * 
   * @returns {Promise<InteractionReplyOptions>} options - The given options 
   */
  async reply(options: InteractionReplyOptions): Promise<InteractionReplyOptions> {
    if (!options.content) options.content = '';

    this.interaction.deferred ? await this.interaction.editReply(options) : await this.interaction.reply(options);

    return options;
  }
}
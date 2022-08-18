import { APIEmbed, EmbedBuilder, EmbedData, User } from 'discord.js';

import { EmbedOptions } from '@types';

import config from '../../config';

/**
 * Represents the client Embed 
 * 
 * @class @extends EmbedBuilder
 */
export class Embed extends EmbedBuilder {

  /**
   * @constructor 
   * 
   * @param {User} user - The current user
   * @param {EmbedOptions} options - The embed options
   * @param {EmbedAuthorOptions} [options.author] - The embed author options
   * @param {Number} [options.color] - The embed color
   * @param {String} [options.description] - The embed description
   * @param {Array<APIEmbedField>} [options.fields] - The embed fields
   * @param {EmbedFooterData} [options.footer] - The embed footer options
   * @param {EmbedAssetData} [options.thumbnail] - The embed thumbnail
   * @param {Number} [options.timestamp] - The embed timestamp
   * @param {String} [options.title] - The embed title
   * @param {String} [options.url] - The embed URL
   */
  constructor(user: User, options: EmbedOptions) {    
    const data: EmbedData | APIEmbed = {
      color: 2895667,
      author: {
        name: options.author?.name ?? 'Miami#7102',
        icon_url: options.author?.iconURL ?? config.avatarURL
      },
      title: options.title,
      description: options.description,
      fields: options.fields,
      thumbnail: options.thumbnail,
      footer: {
        text: `${user.tag} (${user.id})`,
        icon_url: `${user.displayAvatarURL()}`
      }
    }

    super(data);
  }
}
import { APIEmbed, EmbedBuilder, EmbedData } from 'discord.js';

import { EmbedOptions } from '@types';

import config from '../../config';

/**
 * Represents the main Embed builder
 * 
 * @class @extends EmbedBuilder
 */
export class Embed extends EmbedBuilder {

  /**
   * @constructor 
   * 
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
  constructor(options: EmbedOptions) {    
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
        text: options.footer?.text ?? 'Executado por ',
        icon_url: options.footer?.iconURL
      }
    }

    super(data);
  }
}
import { APIEmbed, EmbedBuilder, EmbedData } from 'discord.js';

import { EmbedOptions } from '@types';

import config from '../../config';

export class Embed extends EmbedBuilder {
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
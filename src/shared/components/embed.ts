import config from 'config';
import {
  APIEmbed,
  APIEmbedField,
  EmbedAuthorOptions,
  EmbedBuilder,
  EmbedData,
  User
} from 'discord.js';

import { ClientConfigProps } from '@/config/default';

const clientConfig: ClientConfigProps = config.get<
  ClientConfigProps
>('app.client');

export class EmbedComponent {
  private author?: EmbedAuthorOptions;
  private description?: string;
  private fields?: APIEmbedField[];
  private thumbnail?: string;
  private title?: string;
  private url?: string;

  constructor(private user: User) { };

  public addField(name: string, value: string, inline: boolean = true): this {
    if (!this.fields) this.fields = [];

    this.fields.push({
      name,
      value,
      inline
    });

    return this;
  }

  public setAuthor(name: string, iconURL?: string, url?: string): this {
    this.author = {
      name,
      iconURL: iconURL ?? clientConfig.avatarURL,
      url
    }

    return this;
  }
  
  public setDescription(description: string): this {
    this.description = description;

    return this;
  }

  public setThumbnail(thumbnail: string): this {
    this.thumbnail = thumbnail;

    return this;
  }

  public setTitle(title: string): this {
    this.title = title;

    return this;
  }

  public setURL(url: string): this {
    this.url = url;

    return this;
  }

  public build(): EmbedBuilder {
    const options: EmbedData | APIEmbed = {
      author: {
        name: this.author.name ?? 'Miami#7102',
        iconURL: clientConfig.avatarURL
      },
      color: 2895667,
      description: this.description,
      fields: this.fields ?? [],
      footer: {
        text: `${this.user.tag} (${this.user.id})`,
        iconURL: `${this.user.displayAvatarURL()}`
      },
      thumbnail: {
        url: this.thumbnail
      },
      timestamp: Date.now(),
      title: this.title,
      url: this.url
    }

    return new EmbedBuilder(options);
  }
}
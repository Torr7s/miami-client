import {
  APIEmbed,
  APIEmbedField,
  EmbedAuthorOptions,
  EmbedBuilder,
  EmbedData,
  User
} from 'discord.js';

import config from '../../config';

/**
 * Represents the client Embed 
 * 
 * @class 
 * 
 * @prop {EmbedAuthorOptions} author - The embed author
 * @prop {String} description - The embed description
 * @prop {Array<APIEmbedField>} fields - The embed fields
 * @prop {String} thumbnail - The embed thumbnail 
 * @prop {String} title - The embed title
 * @prop {String} url - The embed url
 */
export class Embed {
  private author?: EmbedAuthorOptions;
  private description?: string;
  private fields?: APIEmbedField[];
  private thumbnail?: string;
  private title?: string;
  private url?: string;

  /**
   * @constructs Embed
   * 
   * @param {User} user - The main user for this embed 
   */
  constructor(private user: User) { };

  /**
   * Append a field to the embed
   * 
   * @param {String} name - The embed field name 
   * @param {String} value - The embed field value 
   * @param {Boolean} [inline] - Wether the embed field is inline
   *  
   * @returns {this} this
   */
  addField(name: string, value: string, inline: boolean = true): this {
    if (!this.fields) this.fields = [];

    this.fields.push({
      name,
      value,
      inline
    });

    return this;
  }

  /**
   * Sets the author of this embed
   * 
   * @param {String} name - The embed author name 
   * @param {String} iconURL - The embed author icon url 
   * @param {String} [url] - The embed author url
   *  
   * @returns {this} this 
   */
  setAuthor(name: string, iconURL?: string, url?: string): this {
    this.author = {
      name,
      iconURL: iconURL ?? config.avatarURL,
      url
    }

    return this;
  }
  
  /**
   * Sets the description of this embed
   * 
   * @param {String} description - The embed description
   *  
   * @returns {this} this 
   */
  setDescription(description: string): this {
    this.description = description;

    return this;
  }

  /**
   * Sets the thumbnail of this embed
   * 
   * @param {String} thumbnail - The URL of the thumbnail
   *  
   * @returns {this} this
   */
  setThumbnail(thumbnail: string): this {
    this.thumbnail = thumbnail;

    return this;
  }

  /**
   * Sets the title of this embed
   * 
   * @param {String} title - The embed title
   *  
   * @returns {this} this 
   */
  setTitle(title: string): this {
    this.title = title;

    return this;
  }

  /**
   * Sets the URL of this embed
   * 
   * @param {String} url - The embed URL
   *  
   * @returns {this} this 
   */
  setURL(url: string): this {
    this.url = url;

    return this;
  }

  /**
   * Build an embed with its properties 
   * 
   * @returns {EmbedBuilder} embed - The builded embed
   */
  build(): EmbedBuilder {
    const options: EmbedData | APIEmbed = {
      author: {
        name: this.author.name ?? 'Miami#7102',
        iconURL: config.avatarURL
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
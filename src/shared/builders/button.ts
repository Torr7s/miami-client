import { APIMessageComponentEmoji, ButtonBuilder, ButtonStyle } from 'discord.js';

import { ButtonOptions } from '@/src/typings';

/**
 * Represents the main Button builder
 * 
 * @class @implements {ButtonOptions}
 * 
 * @prop {String} custom_id - The buttom custom id
 * @prop {Boolean} [disabled] - Wether the button is disabled
 * @prop {APIMessageComponentEmoji} [emoji] - The button emoji to be displayed
 * @prop {String} label - The button label 
 * @prop {ButtonStyle} style: The button style
 *  
 */
export class Button implements ButtonOptions {
  custom_id: string;
  disabled?: boolean;
  emoji?: APIMessageComponentEmoji;
  label: string;
  style: ButtonStyle;

  /**
   * @constructs Button
   * 
   * @param {ButtonOptions} options - The options for this button
   * @param {String} options.custom_id - The buttom custom id
   * @param {Boolean} [options.disabled] - Wether the button is disabled
   * @param {APIMessageComponentEmoji} [options.emoji] - The button emoji to be displayed
   * @param {String} options.label - The button label 
   * @param {ButtonStyle} options.style: The button style
   */
  constructor(options: ButtonOptions) {
    options.disabled ??= false;

    Object.assign(this, options);
  }

  /**
   * Build a button with its options
   * 
   * @method @public
   * 
   * @returns {ButtonBuilder} button - The builded button
   */
  public build(): ButtonBuilder {
    const button: ButtonBuilder = new ButtonBuilder()
      .setCustomId(this.custom_id)
      .setDisabled(this.disabled)
      .setEmoji(this.emoji)
      .setLabel(this.label)
      .setStyle(this.style);

    return button;
  }
}
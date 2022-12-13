import { APIMessageComponentEmoji, ButtonBuilder, ButtonStyle } from 'discord.js';

import { ButtonOptions } from '@/src/typings';

export class ButtonComponent implements ButtonOptions {
  custom_id: string;
  disabled?: boolean;
  emoji?: APIMessageComponentEmoji;
  label: string;
  style: ButtonStyle;

  constructor(options: ButtonOptions) {
    Object.assign(this, {
      ...options,
      disabled: options.disabled ?? false
    });
  }

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
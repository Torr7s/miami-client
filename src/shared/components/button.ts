import { APIMessageComponentEmoji, ButtonBuilder, ButtonStyle } from 'discord.js';

import { ButtonOptions } from '@/src/typings';

export class ButtonComponent implements ButtonOptions {
  custom_id: string;
  label: string;
  style: ButtonStyle;
  disabled?: boolean;
  emoji?: APIMessageComponentEmoji;

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
      .setLabel(this.label)
      .setStyle(this.style);

    this.emoji && button.setEmoji(this.emoji);

    return button;
  }
}
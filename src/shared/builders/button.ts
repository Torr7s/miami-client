import { APIMessageComponentEmoji, ButtonBuilder, ButtonStyle } from 'discord.js';

import { ButtonOptions } from '@types';

export class Button implements ButtonOptions {
  custom_id: string;
  disabled?: boolean;
  emoji?: APIMessageComponentEmoji;
  label: string;
  style: ButtonStyle;

  constructor(buttonOptions: ButtonOptions) {
    buttonOptions.disabled ??= false;

    Object.assign(this, buttonOptions);
  }
  
  build(): ButtonBuilder {
    const button: ButtonBuilder = new ButtonBuilder()
      .setCustomId(this.custom_id)
      .setDisabled(this.disabled)
      .setEmoji(this.emoji)
      .setLabel(this.label)
      .setStyle(this.style);

    return button;
  }
}
import { UserFlagsBitField } from 'discord.js';

export const resolveFlags = (flags: UserFlagsBitField): { flags: string } => {
  const mappedFlags = new UserFlagsBitField(flags)
    .toArray()
    .map((flag: string): string => `\`${flag}\``)
    .join(', ')

  return {
    flags: mappedFlags
  }
}
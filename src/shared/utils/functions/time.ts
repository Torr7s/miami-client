import { time, TimestampStylesString } from 'discord.js';

export function formatTimestamp(date?: string | number | Date, formatter?: TimestampStylesString): string {
  const formattedDate: string = date.toString() === '0'
    ? '00/00/0000'
    : time(new Date(date), formatter ?? 'f');

  return formattedDate;
} 
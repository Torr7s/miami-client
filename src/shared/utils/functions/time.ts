import { time, TimestampStylesString } from 'discord.js';

export const formatTimestamp = (date?: string | number | Date, formatter: TimestampStylesString = 'f'): string => {
  const formattedDate: string = date.toString() === '0'
    ? '00/00/0000'
    : time(new Date(date), formatter);

  return formattedDate;
}
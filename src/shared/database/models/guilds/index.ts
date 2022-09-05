import { Schema, Types } from 'mongoose';
import database from '../..';

import { GuildModel, GuildSchema } from './interfaces/guilds.interface';

const guildSchema = new Schema<GuildSchema, GuildModel>({
  guildId: {
    type: String,
    required: true,
    unique: true
  },
  settings: {
    locale: {
      type: String,
      default: 'pt-BR'
    }
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

guildSchema.static('findOrCreate', async function findOrCreate(guildId: string): Promise<GuildSchema & {
  _id: Types.ObjectId
}> {
  let guild: GuildSchema & { _id: Types.ObjectId } = await this.findOne({ guildId });

  if (!guild) {
    guild = await this.create({
      guildId
    });
  }

  return guild;
});

export default database.model<GuildSchema, GuildModel>('guilds', guildSchema);;
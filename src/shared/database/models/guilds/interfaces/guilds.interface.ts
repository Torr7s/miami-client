import { Document, Model, Types } from 'mongoose';

export interface GuildSchema extends Document {
  guildId: string;
  settings: {
    locale: string;
  };
  createdAt: Date;
}

export interface GuildModel extends Model<GuildSchema> {
  findOrCreate(guildId: string): Promise<GuildSchema & {
    _id: Types.ObjectId
  }>;
}
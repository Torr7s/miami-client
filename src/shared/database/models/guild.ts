import mongoose, { Schema } from 'mongoose';
import database from '..';

export interface GuildSchema extends mongoose.Document {
  guildId: string;
  ownerId?: string;
  settings: {
    locale: string;
  }
  createdAt: Date;
}

const guildSchema = new Schema<GuildSchema>({
  guildId: {
    type: String,
    required: true,
    unique: true
  },
  ownerId: {
    type: String
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

export default database.model<GuildSchema>('guilds', guildSchema);;
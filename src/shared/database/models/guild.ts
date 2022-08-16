import mongoose, { Model, Schema } from 'mongoose';
import database from '..';

export interface GuildSchema extends mongoose.Document {
  guildId: string;
  ownerId?: string;
  locale?: string;
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
  locale: {
    type: String,
    default: 'pt-BR'    
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

const guilds: Model<GuildSchema> = database.model<GuildSchema>('guilds', guildSchema);

export default guilds;
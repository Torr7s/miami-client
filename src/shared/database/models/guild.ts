import mongoose, { Model, Schema } from 'mongoose';

interface GuildSchema {
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

const guilds: Model<GuildSchema> = mongoose.model<GuildSchema>('guilds', guildSchema);

export default guilds;
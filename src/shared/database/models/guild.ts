import mongoose, { Model, Schema, SchemaTypes } from 'mongoose';

interface GuildSchema {
  guildId: string;
  ownerId?: string;
  locale?: string;
  createdAt: Date;
}

const guildSchema = new Schema<GuildSchema>({
  guildId: {
    type: SchemaTypes.String,
    required: true,
    unique: true
  },
  ownerId: {
    type: SchemaTypes.String
  },
  locale: {
    type: SchemaTypes.String,
    default: 'pt-BR'    
  },
  createdAt: {
    type: SchemaTypes.Date,
    default: Date.now()
  }
});

export const guildsDb: Model<GuildSchema> = mongoose.model<GuildSchema>('guilds', guildSchema);
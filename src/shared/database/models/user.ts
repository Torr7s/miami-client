import mongoose, { Model, Schema, SchemaTypes } from 'mongoose';

interface UserSchema {
  userId: string;
  guildId: string;
  rp: number;
  level: number;
  createdAt: Date;
}

const userSchema = new Schema<UserSchema>({
  userId: {
    type: SchemaTypes.String,
    required: true,
    unique: true
  },
  guildId: {
    type: SchemaTypes.String,
    required: true
  },
  rp: {
    type: SchemaTypes.Number,
    default: 0
  },
  level: {
    type: SchemaTypes.Number,
    default: 1
  },
  createdAt: {
    type: SchemaTypes.Date,
    default: Date.now()
  }
});

export const usersDb: Model<UserSchema> = mongoose.model<UserSchema>('users', userSchema);
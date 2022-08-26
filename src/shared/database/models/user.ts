import mongoose, { Schema } from 'mongoose';
import database from '..';

export interface UserSchema extends mongoose.Document {
  userId: string;
  guildId: string;
  cooldowns: {
    daily: number;
  }
  status: {
    rp: number;
    level: number;
    coins: number;
    vip: boolean
  };
  createdAt: Date;
}

const userSchema = new Schema<UserSchema>({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  guildId: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

export default database.model<UserSchema>('users', userSchema);
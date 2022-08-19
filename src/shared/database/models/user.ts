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
  cooldowns: {
    daily: {
      type: Number,
      default: 0
    }
  },
  status: {
    rp: {
      type: Number,
      default: 0
    },
    level: {
      type: Number,
      default: 1
    },
    vip: {
      type: Boolean,
      default: false
    },
    coins: {
      type: Number,
      default: 5000
    }
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

export default database.model<UserSchema>('users', userSchema);
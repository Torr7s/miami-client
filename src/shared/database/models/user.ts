import mongoose, { Model, Schema } from 'mongoose';
import database from '..';

export interface UserSchema extends mongoose.Document {
  userId: string;
  guildId: string;
  rp: number;
  level: number;
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
  rp: {
    type: Number,
    default: 0
  },
  level: {
    type: Number,
    default: 1
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

const users: Model<UserSchema> = database.model<UserSchema>('users', userSchema);

export default users;
import { Schema, Types } from 'mongoose';
import database from '../..';

import { UserModel, UserSchema } from './interfaces/users.interface';

const userSchema = new Schema<UserSchema, UserModel>({
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

userSchema.static('findOrCreate', async function findOrCreate(guildId: string, userId: string): Promise<
  UserSchema & {
    _id: Types.ObjectId
  }> {
    let user:   UserSchema & { _id: Types.ObjectId } = await this.findOne({ guildId, userId });

    if (!user) {
      user = await this.create({
        guildId,
        userId
      });
    }

  return user;
});

export default database.model<UserSchema, UserModel>('users', userSchema);

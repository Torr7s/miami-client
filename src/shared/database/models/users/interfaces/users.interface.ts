import { Document, Model, Types } from 'mongoose';

export interface UserSchema extends Document {
  userId: string;
  guildId: string;
  createdAt: Date;
}

export interface UserModel extends Model<UserSchema> {
  findOrCreate(guildId: string, userId: string): Promise<UserSchema & {
    _id: Types.ObjectId
  }>;
}
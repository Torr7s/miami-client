import mongoose, { Model, Schema } from 'mongoose';

interface UserSchema {
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

const users: Model<UserSchema> = mongoose.model<UserSchema>('users', userSchema);

export default users;
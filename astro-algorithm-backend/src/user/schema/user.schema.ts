// user.schema.ts
import * as mongoose from 'mongoose';

interface CustomUpdateQuery<T extends Document> {
  email?: string;
}

export const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 50,
  },
  email: { type: String, required: true, unique: true },
});

UserSchema.pre('save', function (next) {
  // @ts-ignore
  if (this.isModified('email')) {
    // @ts-ignore
    this.email = this.email.toLowerCase();
  }
  next();
});

UserSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate() as CustomUpdateQuery<any>;
  if (update && update.email) {
    update.email = update.email.toLowerCase();
  }
  next();
});

export const User = mongoose.model('users', UserSchema);

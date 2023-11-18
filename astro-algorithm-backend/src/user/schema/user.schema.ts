// user.schema.ts
import * as mongoose from 'mongoose';

interface UserProfileDocument extends Document {
  avatarURL: string;
  completedChallenges: {
    challengeId: string;
    challengeName: string;
  }[];
  points: number;
}

interface UserDocument extends Document {
  _id: string;
  username: string;
  email: string;
  password: string;
  profile: UserProfileDocument;
  createdAt: Date;
  lastLogin: Date;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface CustomUpdateQuery<T extends Document> {
  email?: string;
}

const userProfileSchema = new mongoose.Schema<UserProfileDocument>({
  avatarURL: {
    type: String,
    required: true,
  },
  completedChallenges: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Challenge',
    },
  ],
  points: {
    type: Number,
    required: true,
  },
});

export const userSchema = new mongoose.Schema<UserDocument>({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profile: {
    type: userProfileSchema,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastLogin: {
    type: Date,
  },
});

userSchema.pre('save', function (next) {
  if (this.isModified('email')) {
    this.email = this.email.toLowerCase();
  }
  next();
});

userSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate() as CustomUpdateQuery<any>;
  if (update && update.email) {
    update.email = update.email.toLowerCase();
  }
  next();
});

export const User = mongoose.model('Users', userSchema);

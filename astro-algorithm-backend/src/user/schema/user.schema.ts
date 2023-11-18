import * as mongoose from 'mongoose';

/**
 * Interface representing user profile data in the database.
 */
interface UserProfileDocument extends mongoose.Document {
  /** URL of the user's avatar */
  avatarURL: string;
  /** List of completed challenges containing their IDs and names */
  completedChallenges: {
    challengeId: string;
    challengeName: string;
  }[];
  /** Number of points associated with the user */
  points: number;
}

/**
 * Interface representing the user document in the database.
 */
interface UserDocument extends mongoose.Document {
  /** Unique identifier for the user */
  _id: string;
  /** User's chosen username */
  username: string;
  /** User's email address */
  email: string;
  /** User's hashed password */
  password: string;
  /** User's profile information */
  profile: UserProfileDocument;
  /** Date when the user account was created */
  createdAt: Date;
  /** Date of the user's last login */
  lastLogin: Date;
}

/**
 * Defines a custom update query for user documents.
 * It allows updating the user's email.
 */
interface CustomUpdateQuery<T extends mongoose.Document> {
  /** New email address for updating the user's email */
  email?: string;
}


/**
 * Schema definition for the user profile.
 */
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

/**
 * Schema definition for the user document.
 */
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

/**
 * Middleware function to convert the email to lowercase before saving the user document.
 */
userSchema.pre('save', function (next) {
  if (this.isModified('email')) {
    this.email = this.email.toLowerCase();
  }
  next();
});

/**
 * Middleware function to convert the updated email to lowercase before updating the user document.
 */
userSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate() as CustomUpdateQuery<any>;
  if (update && update.email) {
    update.email = update.email.toLowerCase();
  }
  next();
});

/**
 * Model for the 'Users' collection based on the user schema.
 */
export const User = mongoose.model<UserDocument>('Users', userSchema);

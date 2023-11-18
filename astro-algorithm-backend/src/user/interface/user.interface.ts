/**
 * Represents user profile data structure.
 */
export interface UserProfile {
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
 * Represents the structure of a user.
 */
export interface User {
  /** Unique identifier for the user */
  _id: string;
  /** User's chosen username */
  username: string;
  /** User's email address */
  email: string;
  /** User's hashed password */
  password: string;
  /** User's profile information */
  profile: UserProfile;
  /** Date when the user account was created */
  createdAt: Date;
  /** Date of the user's last login */
  lastLogin: Date;
}

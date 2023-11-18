export interface UserProfile {
  avatarURL: string;
  completedChallenges: {
    challengeId: string;
    challengeName: string;
  }[];
  points: number;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  password: string;
  profile: UserProfile;
  createdAt: Date;
  lastLogin: Date;
}

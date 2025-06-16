export type Gender = "male" | "female" | "other";
export type User = {
  _id: string;
  fullName: string;
  userName: string;
  email: string;
  password?: string; // Optional for API responses
  gender: Gender;
  profilePic: string;
  bio: string;

  followers: string[]; // Array of user IDs
  following: string[]; // Array of user IDs
  followRequests: string[]; // Array of user IDs
  groups: string[]; // Array of group IDs

  verifyToken?: string;
  verifyTokenExpiry?: string;
  isVerified: boolean;

  resetPasswordToken?: string;
  resetPasswordTokenExpiry?: string;

  isOnline: boolean;

  createdAt: string;
  updatedAt: string;
};

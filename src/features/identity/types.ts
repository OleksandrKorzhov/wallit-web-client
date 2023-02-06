export type UserProfile = {
  id: string;
  homeCountry?: string;
  homeState?: string;
  homeCity?: string;
}

export type UserHomeLocation = Pick<UserProfile, "homeCountry" | "homeState" | "homeCity">;

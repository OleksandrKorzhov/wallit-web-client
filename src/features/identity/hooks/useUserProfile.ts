import {makeVar, useReactiveVar} from "@apollo/client";
import {useCallback, useMemo} from "react";
import {UserProfile} from "../types";

const userProfileVar = makeVar<UserProfile | undefined>(undefined);

export const useUserProfile = (): [UserProfile | undefined, (value: UserProfile) => void] => {
  const userProfile = useReactiveVar(userProfileVar);

  const setUserProfile = useCallback((value: UserProfile) => {
    userProfileVar(value);
  }, []);

  return useMemo(() => [
    userProfile,
    setUserProfile,
  ], [userProfile, setUserProfile]);
};

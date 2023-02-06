import {useLinkedAccounts} from "../../../linked-item/hooks/useLinkedAccounts";
import {useUserHomeLocation} from "../../../geo-info/hooks/useUserHomeLocation";
import React, {useMemo} from "react";
import {Outlet} from "react-router-dom";
import {OnboardingScreen} from "../../../../screens/onboarding/OnboardingScreen";
import {queryUtils} from "../../../../common/utils";
import {useSpendingCategories} from "../../../settings/hooks/useSpendingCategories";
import {InProgressPlaceholder} from "../../../../common/components/placeholders/InProgressPlaceholder";

export function OnboardingControlRouterWrapper() {
  const linkedAccounts = useLinkedAccounts();
  const homeLocation = useUserHomeLocation();
  const spendingCategories = useSpendingCategories();

  const hasConnectedBankAccount = useMemo(() => {
    return Boolean(
      linkedAccounts.data?.node?.__typename === "User" && linkedAccounts.data.node.plaidItems?.length
    );
  }, [linkedAccounts]);

  const hasHomeLocation = useMemo(() => {
    return Boolean(
      homeLocation.country
      && homeLocation.state
      && homeLocation.city
    );
  }, [homeLocation]);

  const hasSpendingCategories = useMemo(() => {
    return Boolean(spendingCategories.savedSpendingCategories.length);
  }, [spendingCategories]);

  const onboardingCompleted = useMemo(() => {
    return hasConnectedBankAccount && hasHomeLocation && hasSpendingCategories;
  }, [linkedAccounts, homeLocation, hasSpendingCategories]);

  if (queryUtils.isLoading(linkedAccounts) || queryUtils.isLoading(homeLocation.query) || queryUtils.isLoading(spendingCategories.query)) {
    return <InProgressPlaceholder/>;
  }

  console.log({onboardingCompleted, hasConnectedBankAccount, hasHomeLocation, hasSpendingCategories});

  return onboardingCompleted
    ? <Outlet/>
    : <OnboardingScreen
      hasConnectedBankAccount={hasConnectedBankAccount}
      hasHomeLocation={hasHomeLocation}
      hasSpendingCategories={hasSpendingCategories}
    />;
}

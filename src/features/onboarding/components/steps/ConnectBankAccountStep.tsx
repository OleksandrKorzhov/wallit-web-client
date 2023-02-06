import AddCardIcon from "@mui/icons-material/AddCard";
import Typography from "@mui/material/Typography";
import {LinkPlaidAccount} from "../../../link-plaid-account/components/LinkPlaidAccount";
import {OnboardingStepContent} from "../common/OnboardingStepContent";
import React from "react";
import {useLinkedAccounts} from "../../../linked-item/hooks/useLinkedAccounts";
import {useSnackbar} from "notistack";

export function ConnectBankAccountStep({onComplete}: {onComplete: () => void}) {
  const linkedAccounts = useLinkedAccounts();
  const {enqueueSnackbar} = useSnackbar();

  const handleAccountLinking = async () => {
    const result = await linkedAccounts.refetch();

    if (result.error) {
      enqueueSnackbar("Some error has happened. The operation will be automatically retried. If you continue to see this message try to reopen the app.", {
        variant: "error",
      });

      return setTimeout(() => {
        handleAccountLinking();
      }, 5000);
    }

    onComplete();
  }

  return (
    <OnboardingStepContent
      icon={AddCardIcon}
      text={() => (
        <>
          Wallit needs <Typography component="b" variant="body1"
                                   fontWeight={700}>read-only</Typography> access to you bank account
          transactions.
          The data will be used to build personalised visualisations for you about your money movements
          and get a maximum possible discount for you prospective spending.
        </>
      )}
      action={(
        <LinkPlaidAccount onAccountLinked={handleAccountLinking}/>
      )}
    />
  );
}

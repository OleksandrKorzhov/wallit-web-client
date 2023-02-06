import {PageBase} from "../../common/components/layout/PageBase";
import {OnboardingStepper} from "../../features/onboarding/components/OnboardingStepper";
import Container from "@mui/material/Container";
import {LinkPlaidAccount} from "../../features/link-plaid-account/components/LinkPlaidAccount";
import Typography from "@mui/material/Typography";
import AddCardIcon from "@mui/icons-material/AddCard";
import Button from "@mui/material/Button";
import React from "react";
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import CategoryIcon from '@mui/icons-material/Category';
import {useAuth0} from "@auth0/auth0-react";
import {OnboardingStepContent} from "../../features/onboarding/components/common/OnboardingStepContent";
import {HomeLocationStep} from "../../features/onboarding/components/steps/HomeLocationStep";
import {CompleteOnboarding} from "../../features/onboarding/components/steps/CompleteOnboarding";
import {SpendingCategoriesStep} from "../../features/onboarding/components/steps/SpendingCategoriesStep";
import {ConnectBankAccountStep} from "../../features/onboarding/components/steps/ConnectBankAccountStep";

type Props = {
  hasConnectedBankAccount: boolean;
  hasHomeLocation: boolean;
  hasSpendingCategories: boolean;
}

export function OnboardingScreen({hasConnectedBankAccount, hasHomeLocation, hasSpendingCategories}: Props) {
  const {user} = useAuth0();

  return (
    <Container maxWidth="lg" sx={{minHeight: "100vh", display: "flex", flexDirection: "column"}}>
      <PageBase>
        <OnboardingStepper
          steps={[
            {
              id: "congratulation",
              label: "Welcome!",
              completed: Boolean(user?.email_verified) || hasConnectedBankAccount || hasHomeLocation || hasSpendingCategories,
              render: ({onComplete}) => {
                return (
                  <OnboardingStepContent
                    icon={SentimentSatisfiedIcon}
                    text="Welcome to Wallit! Seems you have just created your account so let's start your journey. Please answer several important questions that you will see further to help Wallit bring the joy to you."
                    action={(
                      <Button variant="contained" onClick={onComplete}>
                        Start
                      </Button>
                    )}
                  />
                );
              }
            },
            /*@TODO: configure email verification and create a email verification landing screen*/
            {
              id: "verify-email",
              label: "Verify your email",
              completed: Boolean(user?.email_verified),
              render: ({onComplete}) => {
                return (
                  <OnboardingStepContent
                    icon={MarkEmailReadIcon}
                    text="Wallit have sent you a letter to be sure the email you entered belongs to you. Please open your mailbox and click the verification link in the email from Wallit."
                    action={(
                      <Button variant="contained" onClick={onComplete}>
                        I will do
                      </Button>
                    )}
                  />
                );
              },
            },
            {
              id: "connect-bank-account",
              label: "Connect bank account",
              completed: hasConnectedBankAccount,
              render: ({onComplete}) => {
                return (
                  <ConnectBankAccountStep onComplete={onComplete} />
                );
              },
            },
            {
              id: "chose-spending-categories",
              label: "Chose spending categories",
              completed: hasSpendingCategories,
              render: ({onComplete}) => {
                return (
                  <OnboardingStepContent
                    icon={CategoryIcon}
                    text="Select the categories of purchases you interested in the most. Wallit will pay close attention you receive relevant discount offers first of all in the selected categories."
                    action={(
                      <SpendingCategoriesStep onComplete={onComplete} />
                    )}
                  />
                );
              },
            },
            {
              id: "set-home-location",
              label: "Tell about your home location",
              completed: hasHomeLocation,
              render: ({onComplete}) => {
                return <HomeLocationStep onComplete={onComplete}/>;
              },
            }
          ]}
          completeComponent={<CompleteOnboarding/>}
        />
      </PageBase>
    </Container>
  );
}

import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import {DiscountIcon} from "../../features/landing/components/DiscountIcon";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import {alpha, styled} from "@mui/material/styles";
import {grey} from "@mui/material/colors";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import StepContent from "@mui/material/StepContent";
import {RefCallback, useCallback, useEffect, useState} from "react";
import {useAuth0} from "@auth0/auth0-react";
import Hidden from "@mui/material/Hidden";

const RegisterButton = styled(Button)(() => ({
  backgroundColor: "black",
  borderColor: "black",
  color: "white",
  "&:hover": {
    backgroundColor: grey[900],
    borderColor: grey[900],
  }
}));

const LogInButton = styled(Button)(() => ({
  borderColor: "black",
  color: "black",
  "&:hover": {
    backgroundColor: alpha(grey[200], .3),
    borderColor: grey[900],
  }
}));

const MenuTextButton = styled(Button)(() => ({
  color: "black",
  "&:hover": {
    backgroundColor: alpha(grey[200], .3),
  },
}));

export function LandingScreen() {
  const {loginWithRedirect} = useAuth0();
  const [activeSection, setActiveSection] = useState<"how-it-works">();
  const [howItWorksRef, setHowItWorksRef] = useState<HTMLElement>();

  const howItWorksCallbackRef: RefCallback<HTMLElement> = useCallback((target: HTMLElement) => {
    setHowItWorksRef(target);
  }, [setHowItWorksRef]);

  useEffect(() => {
    switch (activeSection) {
      case "how-it-works":
        if (!howItWorksRef) {
          return;
        }

        howItWorksRef.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });

        setActiveSection(undefined);
        break;
    }
  }, [howItWorksRef, activeSection]);

  const handleHowItWorksClick = () => {
    setActiveSection("how-it-works");
  }

  const handleLoginClick = () => {
    loginWithRedirect();
  };

  const handleRegisterClick = () => {
    loginWithRedirect({
      authorizationParams: {
        screen_hint: "signup",
      },
    });
  }

  return (
    <Stack width="100%" minHeight="100vh">
      <Container maxWidth="lg">
        <Stack direction="row" justifyContent="space-between" alignItems="center" height={70}>
          <Typography variant="h1" fontSize={36}>
            Wallit
          </Typography>

          <Stack direction="row" gap={3}>
            <Hidden mdDown>
              <MenuTextButton variant="text" onClick={handleHowItWorksClick}>
                How it works
              </MenuTextButton>
            </Hidden>

            <LogInButton variant="outlined" onClick={handleLoginClick}>
              Log in
            </LogInButton>
            <RegisterButton variant="contained" onClick={handleRegisterClick}>
              Register
            </RegisterButton>
          </Stack>
        </Stack>
      </Container>

      <Divider variant="middle" />

      <Container maxWidth="lg">
        <Stack direction="row" width="100%" height="calc(100vh - 70px)" justifyContent="space-between" alignItems="center">
          <Stack gap={1} width={{xs: "100%", md: "60%"}}>
            <Typography variant="h3" textTransform="uppercase" fontSize={{xs: 32, md: 40}}>
              Get discounts for what you need
            </Typography>

            <Typography variant="subtitle1">
              No hassle, no efforts, simply jump onboard, get discounts and use them
            </Typography>

            <Stack direction="row" alignItems="center" mt={10} gap={3}>
              <RegisterButton size="large" onClick={handleRegisterClick}>
                Register
              </RegisterButton>

              <MenuTextButton size="large" onClick={handleHowItWorksClick}>
                See how it works
              </MenuTextButton>
            </Stack>
          </Stack>

          <Hidden mdDown>
            <DiscountIcon sx={{width: 300, height: 300}} />
          </Hidden>
        </Stack>

        <Stack width="100%" minHeight="100vh" justifyContent="center" alignItems="center" ref={howItWorksCallbackRef}>
          <Typography variant="h4" mb={5}>
            Here how it works
          </Typography>

          <Stepper orientation="vertical">
            <Step active>
              <StepLabel>
                Register on Wallit
              </StepLabel>
              <StepContent>
                {/*@TODO: add collection information about spending categories to the onboarding steps*/}
                <Typography color="text.secondary">
                  Create an account and pass an onboarding process. Wallit will ask a few questions that are important for you further benefit.
                </Typography>
              </StepContent>
            </Step>

            <Step active>
              <StepLabel>
                Connect your bank accounts
              </StepLabel>
              <StepContent>
                <Typography color="text.secondary">
                  When you connect a bank account, Wallit can read information about money flows, perform analysis and find a merchant, store or whatever else who is willing to engage customers in exchange to some discount.
                </Typography>

                <Typography color="text.secondary" mt={2}>
                  Despite, Wallit accesses you financial information be safe - Wallit is super cautious, concerned about security and your privacy so only read access will be required and all the information will be kept privately.
                </Typography>
              </StepContent>
            </Step>

            {/*@TODO: add information about places where a discount can be used*/}
            <Step active>
              <StepLabel>
                Get a discount
              </StepLabel>
              <StepContent>
                <Typography color="text.secondary">
                  As Wallit gets a discount it immediately appears in your account (you even can get a notification about it if you wish) with information about where and how you can get a gift
                </Typography>
              </StepContent>
            </Step>

            <Step active>
              <StepLabel>
                Use a discount
              </StepLabel>
              <StepContent>
                <Typography color="text.secondary">
                  When you purchase something in the appropriate location use a discount that Wallit gives you (show it to the salesperson or enter a code in a form)
                </Typography>
              </StepContent>
            </Step>

            <Step active>
              <StepLabel>Done! Win-win deal!</StepLabel>
            </Step>
          </Stepper>
        </Stack>
      </Container>

      <Divider variant="middle" sx={{my: 5}} />

      <Container maxWidth="lg" sx={{py: 5}}>
        <Stack direction="row">
          <Stack>
            <Typography variant="h5">
              Find us on social media
            </Typography>

            TODO: add social media
          </Stack>
        </Stack>
      </Container>
    </Stack>
  );
}

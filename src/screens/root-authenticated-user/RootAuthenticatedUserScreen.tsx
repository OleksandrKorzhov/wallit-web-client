import {Outlet, useNavigate} from "react-router-dom";
import {gql} from "../../__generated__";
import {useMutation} from "@apollo/client";
import React, {useLayoutEffect} from "react";
import {useUserProfile} from "../../features/identity/hooks/useUserProfile";
import {AsyncOperationStateLayout} from "../../common/components/layout/AsyncOperationStateLayout";
import CircularProgress from "@mui/material/CircularProgress";
import {FillAndCenter} from "../../common/components/layout/FillAndCenter";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import LockIcon from "@mui/icons-material/Lock";
import Stack from "@mui/material/Stack";
import {useAuth0} from "@auth0/auth0-react";
import { queryUtils } from "../../common/utils";
import config from "../../config";

const EXCHANGE_AUTH_TOKEN_FOR_USER_PROFILE = gql(/* GraphQL */ `
    mutation ExchangeAuthTokenForUserProfile($identityProviderId: String!) {
        exchangeAuthTokenForUserProfile(input: {identityProviderID: $identityProviderId}) {
            id
            identityProviderID
        }
    }
`);

export default function RootAuthenticatedUserScreen() {
  const {isAuthenticated, isLoading, user} = useAuth0();
  const [, setUserProfile] = useUserProfile();
  const [exchangeAuthTokenForUserProfile, exchangeTokenState] = useMutation(EXCHANGE_AUTH_TOKEN_FOR_USER_PROFILE);
  const navigate = useNavigate();

  useLayoutEffect(() => {
    if (isLoading || !isAuthenticated || !user) {
      return;
    }

    ;(async () => {
      const result = await exchangeAuthTokenForUserProfile({
        // variables: {identityProviderId: "auth0_" + Math.random() + "_" + Date.now()}
        // variables: {identityProviderId: "auth0_test_8"}
        variables: {identityProviderId: user.sub!}
      });

      if (result.errors) {
        return;
      }

      console.log(`identity provider id ${user.sub}; internal user id: ${result.data?.exchangeAuthTokenForUserProfile.id}`);

      setUserProfile({id: result.data!.exchangeAuthTokenForUserProfile.id});
    })();
  }, [exchangeAuthTokenForUserProfile, setUserProfile, user, isAuthenticated, isLoading]);

  const handleReload = () => {
    // @TODO: add here cleaning up of the auth state and redirect to the auth screen
    // navigate(-1);
    navigate(config.routing.landing());
  };

  const handleRedirectToLandingPage = () => {
    navigate(config.routing.landing());
  };

  if (queryUtils.isLoading(exchangeTokenState) || isLoading) {
    return (
      <FillAndCenter>
        <CircularProgress />
      </FillAndCenter>
    );
  }

  if (!isAuthenticated) {
    return (
      <FillAndCenter>
        <LockIcon sx={{width: 200, height: 200, mb: 5}} />

        <Typography variant="h6">
          You seems to don't have access to it ;)
        </Typography>
        <Typography variant="body2" align="center" mt={1}>
          Please authenticate and try again
        </Typography>

        <Button variant="contained" onClick={handleRedirectToLandingPage} sx={{mt: 5}}>
          Go to home page
        </Button>
      </FillAndCenter>
    );
  }

  return (
    <AsyncOperationStateLayout
      operation={exchangeTokenState}
      component={Stack}
      loading={(
        <FillAndCenter>
          <CircularProgress size={24}/>
        </FillAndCenter>
      )}
      error={(
        <FillAndCenter>
          <LockIcon sx={{width: 200, height: 200}}/>

          <Typography variant="h6" align="center">
            Something went wrong during your identity check!
          </Typography>
          <Typography variant="body2" align="center">
            Please try again in a minute
          </Typography>

          <Button sx={{mt: 5, width: 200}} variant="contained" onClick={handleReload}>
            Reload
          </Button>
        </FillAndCenter>
      )}
      sx={{height: "auto", minHeight: "100vh"}}
    >
      <Outlet/>
      {/*<LayoutWithToolbarAndDrawerMenu>*/}
      {/*  <Outlet/>*/}
      {/*</LayoutWithToolbarAndDrawerMenu>*/}
    </AsyncOperationStateLayout>
  )
}

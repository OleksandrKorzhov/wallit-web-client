import React from "react";
import {LoadingButton} from "@mui/lab";
import {useMutation} from "@apollo/client";
import {gql} from "../../../__generated__";
import {useUserProfile} from "../../identity/hooks/useUserProfile";
import {SxProps} from "@mui/material";
import {PlaidLinkWrapper} from "./PlaidLinkWrapper";
import {useSnackbar} from "notistack";

const CREATE_LINK_TOKEN = gql(/* GraphQL */`
    mutation CreateLinkToken($userId: ID!) {
        createLinkToken(input: { userId: $userId }) {
            linkToken
        }
    }
`);

const EXCHANGE_PUBLIC_TOKEN = gql(/* GraphQL */`
    mutation ExchangePublicToken($userId: ID!, $publicToken: String!) {
        exchangePublicToken(input: {userId: $userId, publicToken: $publicToken})
    }
`);

type Props = {
  onAccountLinked: () => void;
  sx?: SxProps;
}

export function LinkPlaidAccount({onAccountLinked, sx}: Props) {
  const [createLinkToken, createLinkTokenState] = useMutation(CREATE_LINK_TOKEN);
  const [exchangePublicToken, exchangePublicTokenState] = useMutation(EXCHANGE_PUBLIC_TOKEN);
  const [userProfile] = useUserProfile();
  const {enqueueSnackbar} = useSnackbar();

  const handleLinkAccount = async () => {
    createLinkToken({
      variables: {userId: userProfile!.id}
    });
  };

  const handleSuccessfulLinking = async (publicToken: string) => {
    createLinkTokenState.reset();

    await exchangePublicToken({
      variables: {userId: userProfile!.id, publicToken: publicToken}
    });

    onAccountLinked();
  };

  const handleFailedLinking = () => {
    createLinkTokenState.reset();

    enqueueSnackbar("Something went wrong during linking a bank account", {
      variant: "error",
    });
  };

  return (
    <>
      {!!createLinkTokenState.data?.createLinkToken.linkToken ? (
        <PlaidLinkWrapper
          token={createLinkTokenState.data.createLinkToken.linkToken}
          onSuccess={handleSuccessfulLinking}
          onError={handleFailedLinking}
        />
      ) : null}

      <LoadingButton
        variant="contained"
        onClick={handleLinkAccount}
        disabled={createLinkTokenState.loading || exchangePublicTokenState.loading || !!createLinkTokenState.data?.createLinkToken.linkToken}
        sx={{
          width: {xs: "100%", md: 200},
          ...sx
        }}
      >
        Link account
      </LoadingButton>
    </>
  );
}

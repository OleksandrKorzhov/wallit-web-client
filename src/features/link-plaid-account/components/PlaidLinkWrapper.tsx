import {useEffect, useState} from "react";
import {PlaidLinkError, usePlaidLink} from "react-plaid-link";

type Props = {
  token: string;
  onSuccess: (token: string) => void | Promise<void>;
  onError: (error: PlaidLinkError | null) => void | Promise<void>;
}

export function PlaidLinkWrapper({token, onSuccess, onError}: Props) {
  const [linkOpened, setLinkOpened] = useState(false);

  const {open, ready} = usePlaidLink({
    token: token || null,
    onSuccess: async public_token => {
      console.log("Public token: " + public_token);

      setLinkOpened(false);
      onSuccess(public_token);
    },
    onExit: error => {
      console.error("error", error);

      setLinkOpened(false);
      onError(error);
    },
  });

  useEffect(() => {
    if (!ready || linkOpened) {
      console.warn("Linking process is not ready or iss running!");
      return;
    }

    setLinkOpened(true)
    open();
  }, [ready, open, linkOpened, setLinkOpened])

  return null;
}

import {SnackbarKey, useSnackbar} from "notistack";
import Button from "@mui/material/Button";
import React from "react";
import {useTheme} from "@mui/material/styles";

export function SnackbarCloseButton(key: SnackbarKey) {
  const {closeSnackbar} = useSnackbar();
  const theme = useTheme();

  const handleClick = () => {
    closeSnackbar(key)
  }

  return (
    <Button
      variant="text"
      onClick={handleClick}
      size="small"
      sx={{
        color: theme.palette.common.white
      }}
    >
      Dismiss
    </Button>
  );
}

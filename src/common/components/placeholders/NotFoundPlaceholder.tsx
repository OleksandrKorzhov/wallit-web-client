import React, {PropsWithChildren} from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import {SxProps, useTheme} from "@mui/material/styles";
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';

type Props = {
  sx?: SxProps;
}

export function NotFoundPlaceholder({children, sx}: PropsWithChildren<Props>) {
  const theme = useTheme();

  return (
    <Stack
      component={Paper}
      bgcolor={theme.palette.grey["50"]}
      elevation={0}
      flexGrow={1}
      height="100%"
      width="100%"
      alignItems="center"
      justifyContent="center"
      sx={sx}
    >
      <SentimentDissatisfiedIcon sx={{mb: 2, width: 100, height: 100, color: "text.secondary"}} />

      <Typography
        variant="subtitle1"
        textTransform="uppercase"
        color="text.secondary"
        textAlign="center"
      >
        {children}
      </Typography>
    </Stack>
  );
}

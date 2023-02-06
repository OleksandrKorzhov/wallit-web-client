import Typography from "@mui/material/Typography";
import {Center} from "../../../../common/components/layout/Center";
import React from "react";

type Props = {
  icon: React.ComponentType<any>;
  text: (() => React.ReactNode) | React.ReactNode;
  action: React.ReactNode;
}

export function OnboardingStepContent({icon: Icon, text, action}: Props) {
  return (
    <Center width={{xs: 300, md: 500}}>
      <Icon sx={{width: 100, height: 100, mb: 5}} />

      <Typography variant="body1" textAlign="center" mb={10}>
        {typeof text === "function" ? text() : text}
      </Typography>

      {action}
    </Center>
  );
}

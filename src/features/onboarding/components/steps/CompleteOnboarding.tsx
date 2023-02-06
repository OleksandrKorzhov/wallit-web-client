import {useNavigate} from "react-router-dom";
import config from "../../../../config";
import Stack from "@mui/material/Stack";
import CheckIcon from "@mui/icons-material/Check";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import React from "react";

export function CompleteOnboarding() {
  const navigate = useNavigate();

  const handleCompleteClick = () => {
    navigate(config.routing.dashboard())
  };

  return (
    <Stack gap={10} justifyContent="center" alignItems="center">
      <CheckIcon sx={{width: 100, height: 100, color: "green"}} />

      <Typography variant="body1">
        Congratulations you have completed the onboarding!
      </Typography>

      <Button
        variant="contained"
        onClick={handleCompleteClick}
      >
        Go do dashboard
      </Button>
    </Stack>
  );
}

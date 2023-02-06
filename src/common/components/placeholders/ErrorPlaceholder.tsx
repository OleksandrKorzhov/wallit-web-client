import ErrorIcon from "@mui/icons-material/Error";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import {FillAndCenter} from "../layout/FillAndCenter";
import React from "react";

export function ErrorPlaceholder() {
  const handleReloadClick = () => {
    window.location.reload();
  };

  return (
    <FillAndCenter>
      <ErrorIcon sx={{width: 200, height: 200}} />

      <Typography variant="h6" align="center">
        Something went wrong.. =(
      </Typography>
      <Typography variant="body2" align="center">
        Please try again in a minute
      </Typography>

      <Button sx={{mt: 5, width: 200}} variant="contained" onClick={handleReloadClick}>
        Reload
      </Button>
    </FillAndCenter>
  );
}

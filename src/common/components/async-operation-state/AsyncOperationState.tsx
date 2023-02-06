import React, {ComponentProps, PropsWithChildren} from "react";
import {AsyncOperationStateLayout} from "../layout/AsyncOperationStateLayout";
import {FillAndCenter} from "../layout/FillAndCenter";
import CircularProgress from "@mui/material/CircularProgress";
import ErrorIcon from "@mui/icons-material/Error";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

type Props = Omit<ComponentProps<typeof AsyncOperationStateLayout>, "error" | "loading">;

export function AsyncOperationState({children, operation, component, ...props}: PropsWithChildren<Props>) {
  const handleReloadClick = () => {
    window.location.reload();
  };

  return (
    <AsyncOperationStateLayout
      operation={operation}
      loading={(
        <FillAndCenter>
          <CircularProgress size={24} />
        </FillAndCenter>
      )}
      error={(
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
      )}
      component={component}
      {...props}
    >
      {children}
    </AsyncOperationStateLayout>
  );
}

import {PropsWithChildren} from "react";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import {LoadingButton} from "@mui/lab";

type Props = {
  title: string;
  text: string;
  allowSaveChanges: boolean;
  onSave: () => any | Promise<any>;
  saveInProgress: boolean;
};

export function SettingsBock({
                               title,
                               text,
                               allowSaveChanges,
                               onSave,
                               saveInProgress,
                               children
                             }: PropsWithChildren<Props>) {
  return (
    <Stack direction="column" gap={2}>
      <Typography variant="h5" textAlign="left">
        {title}
      </Typography>

      <Divider variant="fullWidth" sx={{mt: -1}}/>

      <Typography paragraph color="text.secondary">
        {text}
      </Typography>

      {children}

      <Stack direction="row" justifyContent="flex-end">
        <LoadingButton
          variant="contained"
          onClick={onSave}
          disabled={!allowSaveChanges}
          loading={saveInProgress}
        >
          Save
        </LoadingButton>
      </Stack>
    </Stack>
  );
}

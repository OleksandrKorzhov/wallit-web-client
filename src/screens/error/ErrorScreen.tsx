import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';
import {useRouteError} from "react-router-dom";

// @TODO: add communication with error reporting tool
export default function ErrorScreen() {
  const error = useRouteError() as {statusText?: string; message?: string};

  console.error(error);

  return (
    <Stack
      direction={{xs: "column", md: "row"}}
      justifyContent="center"
      alignItems="center"
      sx={{
        flexGrow: 1,
        height: '100%'
      }}
    >
      {/*<Icon sx={{width: 200, height: 200}}>*/}
      {/*</Icon>*/}
      <ReportGmailerrorredIcon
        sx={{
          width: {xs: 200, md: 400},
          height: {xs: 200, md: 400},
          mb: {xs: 5, md: 0},
          mr: {md: 5},
      }}
      />
      <Stack
        direction="column"
        width={360}
        justifyContent="center"
        alignItems={{xs: "center", md: "flex-start"}}
      >
        <Typography variant="h6">
          Opps.. Some error has happened!
        </Typography>
        <Typography variant="body1">
          Don't worry we're working to fix it!
        </Typography>
        <Typography variant="body2" marginTop={5}>
          {error?.statusText || error?.message}
        </Typography>
      </Stack>
    </Stack>
  );
}

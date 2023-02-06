import {Insights} from "@mui/icons-material";
import {pink} from "@mui/material/colors";
import Typography from "@mui/material/Typography";
import {NotificationBase} from "./NotificationBase";

type Props = {
  id: string;
  onOpen: (id: string) => any | Promise<any>;
}

export function InsightNotification({id, onOpen}: Props) {
  const handleClick = () => {
    onOpen(id);
  }

  return (
    <NotificationBase
      onClick={handleClick}
      icon={
        <Insights stroke={pink["300"]} />
      }
    >
      <Typography variant="body1">
        Wallit has new insights about your spending. Go check your stats!
      </Typography>
    </NotificationBase>
  );
}

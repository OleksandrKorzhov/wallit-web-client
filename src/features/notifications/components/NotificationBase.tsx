import React, {PropsWithChildren} from "react";
import ListItemButton from "@mui/material/ListItemButton";
import Paper from "@mui/material/Paper";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItem from "@mui/material/ListItem";

type Props = {
  icon: React.ReactElement;
  onClick: () => void;
}

export function NotificationBase({icon, onClick, children}: PropsWithChildren<Props>) {
  return (
    <ListItem onClick={onClick} sx={{py: .5}}>
      <ListItemButton sx={{display: "flex", alignItems: "center"}} component={Paper}>
        <ListItemAvatar>
          {icon}
        </ListItemAvatar>

        {children}
      </ListItemButton>
    </ListItem>
  );
}

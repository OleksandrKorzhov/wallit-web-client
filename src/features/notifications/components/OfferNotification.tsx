import {NotificationBaseProps} from "../types";
import {LocalOffer} from "@mui/icons-material";
import Typography from "@mui/material/Typography";
import {green} from "@mui/material/colors";
import Chip from "@mui/material/Chip";
import {DiscountOfferItemType} from "../../../common/types";
import format from "date-fns/format";
import Stack from "@mui/material/Stack";
import {NotificationBase} from "./NotificationBase";

type Props = NotificationBaseProps & Pick<DiscountOfferItemType, "expiresAt">;

export function OfferNotification({id, expiresAt, onOpen}: Props) {
  const handleClick = () => {
    onOpen(id);
  }

  return (
    <NotificationBase
      onClick={handleClick}
      icon={
        <LocalOffer
          stroke={green["600"]}
          sx={{
            "& path": {
              color: green["600"],
            },
          }}
        />
      }
    >
      <Stack
        direction="row"
        flexWrap="wrap"
        justifyContent="space-between"
        alignItems="center"
        gap={1}
        width="100%"
      >
        <Typography variant="body2" flexBasis="50%" flexGrow={1}>
          Wallit has a new discount offer for you!
        </Typography>

        <Chip
          color="secondary"
          variant="filled"
          label={"Expires at: " + format(expiresAt, "yyyy-MM-dd")}
          sx={{flexGrow: 1}}
        />
      </Stack>
    </NotificationBase>
  );
}

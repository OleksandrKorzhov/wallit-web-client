import {DiscountOfferItemType} from "../../../common/types";
import ListItemButton from "@mui/material/ListItemButton";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import {DiscountOfferType} from "../../../__generated__/graphql";
import Tooltip from "@mui/material/Tooltip";
import Chip from "@mui/material/Chip";
import format from "date-fns/format";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
import Alert from "@mui/material/Alert";
import ListItem from "@mui/material/ListItem";
import {useCallback, useState} from "react";
import {ImportantContent} from "./ImportantContent";
import Box from "@mui/material/Box";
import { stringUtils } from "../../../common/utils";

type Props = DiscountOfferItemType & {
  preSelectedItemId?: string;
};

export function DiscountOfferListItem({
  id,
  preSelectedItemId,
  amount,
  type,
  ownerMerchant,
  expiresAt,
  merchantSpecificIdentification,
  currency,
  description,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const rootRef = useCallback((target: HTMLElement | null) => {
    if (stringUtils.equals(id, preSelectedItemId) && target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      setIsOpen(true);
    }
  }, [preSelectedItemId, id]);

  const toggleOpen = () => {
    setIsOpen(value => !value);
  }

  return (
    <ListItem onClick={toggleOpen} ref={rootRef}>
      <ListItemButton component={Paper}>
        <Stack width="100%">
          <Stack direction="row" flexWrap="wrap" gap={1} justifyContent="space-between" alignItems="center">
            <Typography
              variant="subtitle1"
              fontWeight={500}
              whiteSpace="nowrap"
              textAlign="left"
              mr="auto"
              minWidth="30%"
            >
              {/*@TODO: add currency for fixed percent discount*/}
              {amount} {type === DiscountOfferType.PercentFromPrice ? "%" : currency}
            </Typography>

            <Tooltip title={ownerMerchant.name}>
              <Chip
                variant="filled"
                color="info"
                label={"From: " + ownerMerchant.name}
                sx={{flexBasis: "15%", flexGrow: {xs: 1, md: 0}}}
              />
            </Tooltip>

            <Tooltip title={format(expiresAt, "yyyy-MM-hh")}>
              <Chip
                variant="filled"
                color="secondary"
                label={"Expires at: " + format(expiresAt, "yyyy-MM-dd")}
                sx={{flexBasis: "20%", flexGrow: {xs: 1, md: 0}}}
              />
            </Tooltip>
          </Stack>

          <Collapse
            style={{width: "100%"}}
            appear={false}
            in={isOpen}
          >
            <Divider variant="fullWidth" sx={{my: 2}} />

            {/*@TODO: add discount offer description field*/}
            <Alert variant="outlined" color="info">
              {description}
            </Alert>

            <Divider variant="fullWidth" sx={{my: 2}} />

            {/*@TODO: add information about discount consumer*/}
            <ImportantContent
              title="Consumer ID (email/phone number)"
              content="williepart3@gmail.com"
            />

            <ImportantContent
              title="Use the information below to identify discount in store"
              content={merchantSpecificIdentification}
            />

            <Box sx={{mb: 1}} />
          </Collapse>
        </Stack>
      </ListItemButton>
    </ListItem>
  );
}

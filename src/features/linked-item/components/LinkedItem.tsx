import ListItemButton from "@mui/material/ListItemButton";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import React, {useState} from "react";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Collapse from "@mui/material/Collapse";
import Fade from "@mui/material/Fade";
import {styled} from "@mui/material/styles";
import Box from "@mui/material/Box";
import {useNavigate} from "react-router-dom";
import {pathUtils} from "../../../common/utils";
import config from "../../../config";
import {AccountItemType} from "../../../common/types";

type Props = {
  // item: any;
  institution: { name: string };
  accounts: Array<AccountItemType>;
}

const HoverablePaper = styled(Paper)(({theme}) => ({
  ":hover": {
    boxShadow: theme.shadows[2],
  }
}))

export function LinkedItem({institution, accounts}: Props) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleOpenToggle = () => {
    setOpen(value => !value)
  }

  const handleAccountClick = (accountId: string) => () => {
    const path = pathUtils.templateToPath(config.routing.accountDetails(), {
      id: accountId,
    });

    navigate(path);
  };

  return (
    <HoverablePaper>
      <Stack direction="column" alignItems="stretch" sx={{width: "100%"}} onClick={handleOpenToggle}>
        <Stack direction="column" p={2} sx={{cursor: "pointer"}}>
          <Typography
            variant="h6"
            sx={{textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden"}}
          >
            {institution.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {accounts.length} Bank accounts
          </Typography>
        </Stack>

        <Fade appear={false} in={open} unmountOnExit>
          <Divider sx={{my: 1}} variant="middle"/>
        </Fade>

        <Collapse style={{width: "100%"}} orientation="vertical" in={open} appear={false}>
          <Stack direction="column" alignItems="stretch" sx={{width: '100%'}}>
            {accounts.map((account: AccountItemType) => (
              <ListItemButton key={account.id} sx={{width: "100%"}}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  my={1}
                  sx={{width: "100%"}}
                  onClick={handleAccountClick(account.id)}
                >
                  <Box sx={{flexGrow: 1, overflow: "hidden"}}>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                      }}
                    >
                      {account.name}
                    </Typography>
                  </Box>

                  <Tooltip title="Balance" placement="left">
                    <Chip
                      variant="filled"
                      color="secondary"
                      label={`Balance: ${account.balanceAvailable || 0 + " " + account.balanceIsoCurrencyCode}`}
                      sx={{flexBasis: 200, flexShrink: 0, flexGrow: 0, textAlign: "left"}}
                    />
                  </Tooltip>
                </Stack>
              </ListItemButton>
            ))}
          </Stack>
        </Collapse>
      </Stack>
    </HoverablePaper>
  )
}

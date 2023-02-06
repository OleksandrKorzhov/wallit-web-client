import {FinancialInstitutionItemType} from "../../../common/types";
import {Fill} from "../../../common/components/layout/Fill";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import {LinkedItem} from "./LinkedItem";
import {NotFoundPlaceholder} from "../../../common/components/placeholders/NotFoundPlaceholder";
import React from "react";

type Props = {
  institutions: FinancialInstitutionItemType[];
};

/*@TODO: add standard gutters to the theme configuration (margins, paddings)*/
export function LinkedItemsList({institutions}: Props) {
  return (
    <Fill
      component={Stack}
      direction="column"
      sx={{
        mx: -2,
        mb: {xs: 2, md: 1},
        width: "auto",
        overflow: "hidden",
      }}
    >
      {institutions.length ? (
        <>
          <Typography variant="h5" align="center" px={2}>
            Linked accounts
          </Typography>

          <Divider flexItem sx={{mt: 1, mx: 2}}/>

          <Stack
            spacing={1}
            flexGrow={1}
            sx={{
              overflow: "auto",
              px: 2,
              py: 1,
            }}
          >
            {institutions.map((institution, idx) => (
              <LinkedItem
                key={idx}
                institution={institution}
                accounts={institution.accounts}
              />
            ))}
          </Stack>
        </>
      ) : (
        <NotFoundPlaceholder
          sx={{
            mx: 2,
            width: "auto",
            mb: {xs: 2, md: 1}
          }}
        >
          You dont have linked accounts yet
        </NotFoundPlaceholder>
      )}
    </Fill>
  );
}

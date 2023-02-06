import React, {useMemo} from 'react';
import {gql} from "../../__generated__";
import {useQuery} from "@apollo/client";
import {AsyncOperationState} from "../../common/components/async-operation-state/AsyncOperationState";
import {useUserProfile} from "../../features/identity/hooks/useUserProfile";
import useMediaQuery from "@mui/material/useMediaQuery";
import {AppTheme} from "../../theme";
import {LinkPlaidAccount} from "../../features/link-plaid-account/components/LinkPlaidAccount";
import {PageBase} from "../../common/components/layout/PageBase";
import {LinkedItemsList} from "../../features/linked-item/components/LinkedItemsList";
import {queryUtils} from '../../common/utils';
import {FinancialInstitutionItemType} from "../../common/types";
import {useLinkedAccounts} from "../../features/linked-item/hooks/useLinkedAccounts";

// const GET_LINKED_ACCOUNTS = gql(/* GraphQL */`
//     query GetUserWithPlaidItems($userId: ID!) {
//         node(id: $userId) {
//             id
//             ... on User {
//                 plaidItems {
//                     institution {
//                         name
//                         accounts {
//                             id
//                             name
//                             type
//                             balanceAvailable
//                             balanceCurrent
//                             balanceIsoCurrencyCode
//                         }
//                     }
//                 }
//             }
//         }
//     }
// `);

function LinkBankAccountScreen() {
  const isMobile = useMediaQuery<AppTheme>((theme) => theme.breakpoints.down("md"));
  const [userProfile] = useUserProfile();
  // const theme = useTheme();

  const linkedAccountsState = useLinkedAccounts();
  // const linkedAccountsState = useQuery(GET_LINKED_ACCOUNTS, {
  //   variables: {userId: userProfile!.id}
  // });

  const handleAccountLinkCompletion = () => {
    linkedAccountsState.refetch();
  }

  const institutions = useMemo((): FinancialInstitutionItemType[] => {
    if (queryUtils.isLoadingOrError(linkedAccountsState) || linkedAccountsState.data?.node?.__typename !== "User") {
      return [];
    }

    const result: FinancialInstitutionItemType[] = [];

    for (const plaidItem of linkedAccountsState.data.node.plaidItems || []) {
      if (plaidItem.__typename !== "PlaidItem" || !plaidItem.institution) {
        continue;
      }

      result.push({
        name: plaidItem.institution.name,
        accounts: (plaidItem.institution.accounts || []).map(account => ({
          name: account.name,
          balanceAvailable: account.balanceAvailable,
          balanceCurrent: account.balanceCurrent,
          id: account.id,
          balanceIsoCurrencyCode: account.balanceIsoCurrencyCode,
        }))
      });
    }

    return result;
  }, [linkedAccountsState]);

  return (
    <AsyncOperationState component={PageBase} variant="single-page" operation={linkedAccountsState}>
      {!isMobile
        ? <LinkPlaidAccount
          onAccountLinked={handleAccountLinkCompletion}
          sx={{
            ml: "auto",
            mb: 5,
          }}
        />
        : null}

      <LinkedItemsList
        institutions={institutions}
      />

      {isMobile
        ? <LinkPlaidAccount
          onAccountLinked={handleAccountLinkCompletion}
          sx={{
            mt: "auto",
          }}
        />
        : null}
    </AsyncOperationState>
  );
}

export default LinkBankAccountScreen

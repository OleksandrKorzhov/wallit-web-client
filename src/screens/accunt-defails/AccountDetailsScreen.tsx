import {useParams} from "react-router-dom";
import {gql} from "../../__generated__";
import Typography from "@mui/material/Typography";
import {useQuery} from "@apollo/client";
import {AsyncOperationState} from "../../common/components/async-operation-state/AsyncOperationState";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Box from "@mui/material/Box";
import {NotFoundPlaceholder} from "../../common/components/placeholders/NotFoundPlaceholder";
import {
  TransactionsInsightChartByField
} from "../../features/spending-insight/components/TransactionsInsightChartByField";
import {TransactionsTable} from "../../features/spending-insight/components/TransactionsTable";
import {Center} from "../../common/components/layout/Center";
import {
  TransactionsInsightsChartByDate
} from "../../features/spending-insight/components/TransactionsInsightsChartByDate";
import {useMemo} from "react";
import {TransactionItemType} from "../../common/types";
import {PageBase} from "../../common/components/layout/PageBase";
import { queryUtils } from "../../common/utils";


const GET_ACCOUNT_TRANSACTIONS = gql(/*GraphQL*/`
    query GetAccountTransactions($accountId: ID!) {
        node(id: $accountId) {
            id
            ... on PlaidInstitutionAccount {
                name
                balanceAvailable
                balanceCurrent
                balanceIsoCurrencyCode
                transactions(orderBy: {field: DATE, direction: DESC}) {
                    edges {
                        node {
                            amount
                            isoCurrencyCode
                            name
                            merchantName
                            category
                            date
                            datetime
                        }
                    }
                }
            }
        }
    }
`);

export function AccountDetailsScreen() {
  const {id} = useParams<{ id: string }>();
  const accountInfoQueryState = useQuery(GET_ACCOUNT_TRANSACTIONS, {
    variables: {accountId: id!},
    skip: !id,
  });

  const transactions = useMemo((): TransactionItemType[] => {
    if (queryUtils.isLoadingOrError(accountInfoQueryState) || accountInfoQueryState.data?.node?.__typename !== "PlaidInstitutionAccount") {
      return [];
    }

    const result: TransactionItemType[] = [];

    for (const item of (accountInfoQueryState.data.node.transactions.edges || [])) {
      if (item?.node?.__typename !== "Transaction") {
        continue;
      }

      result.push({
        ...item.node,
        category: "",
      });
    }

    return result;
  }, [accountInfoQueryState]);

  return (
    <AsyncOperationState
      component={PageBase}
      operation={accountInfoQueryState}
    >
      {accountInfoQueryState.data?.node?.__typename !== "PlaidInstitutionAccount" ? (
        <NotFoundPlaceholder>
          No information about account
        </NotFoundPlaceholder>
      ) : (
        <>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h4">
              {accountInfoQueryState.data.node.name}
            </Typography>

            <Chip variant="filled" color="info" label={accountInfoQueryState.data.node.balanceIsoCurrencyCode}/>
          </Stack>

          <Divider variant="fullWidth" sx={{my: 2}}/>

          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="subtitle1">
              Current balance
            </Typography>

            <Chip
              variant="filled"
              color="secondary"
              label={accountInfoQueryState.data.node.balanceCurrent + " " + accountInfoQueryState.data.node.balanceIsoCurrencyCode}
            />
          </Stack>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mt={1}>
            <Typography variant="subtitle1">
              Available balance
            </Typography>

            <Chip
              variant="filled"
              color="secondary"
              label={accountInfoQueryState.data.node.balanceAvailable + " " + accountInfoQueryState.data.node.balanceIsoCurrencyCode}
            />
          </Stack>

          {
            transactions.length ? (
              <>
                <Center direction="column" gap={5} my={3}>

                  <Stack direction={{xs: "column", md: "row"}} justifyContent="space-between" alignItems="flex-start" gap={5}>
                    <TransactionsInsightChartByField
                      id="transactions-insights-by-category"
                      title="Spending by category"
                      field="category"
                      transactions={transactions}
                    />
                    <TransactionsInsightChartByField
                      id="transactions-insights-by-merchant"
                      title="Spending by merchant"
                      field="name"
                      transactions={transactions}
                    />
                  </Stack>

                  <TransactionsInsightsChartByDate
                    id="transactions-insights-by-date"
                    title="Spending by month"
                    transactions={transactions}
                    height={300}
                  />
                </Center>

                <Box my={3}/>

                <TransactionsTable
                  transactions={transactions}
                  sx={{
                    height: 500,
                  }}
                />
              </>
            ) : null
          }
        </>
      )}
    </AsyncOperationState>
  );
}

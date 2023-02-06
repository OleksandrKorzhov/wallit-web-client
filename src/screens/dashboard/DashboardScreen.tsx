import {gql} from "../../__generated__";
import {useQuery} from "@apollo/client";
import {useUserProfile} from "../../features/identity/hooks/useUserProfile";
import {AsyncOperationState} from "../../common/components/async-operation-state/AsyncOperationState";
import {PageBase} from "../../common/components/layout/PageBase";
import {useMemo} from "react";
import {FinancialInstitutionItemType, TransactionItemType} from "../../common/types";
import {queryUtils} from "../../common/utils";
import {LinkedItemsList} from "../../features/linked-item/components/LinkedItemsList";
import {NotFoundPlaceholder} from "../../common/components/placeholders/NotFoundPlaceholder";
import Stack from "@mui/material/Stack";
import {
  TransactionsInsightChartByField
} from "../../features/spending-insight/components/TransactionsInsightChartByField";
import {TransactionsTable} from "../../features/spending-insight/components/TransactionsTable";
import {
  TransactionsInsightsChartByDate
} from "../../features/spending-insight/components/TransactionsInsightsChartByDate";

const GET_ACCOUNTS_AND_TRANSACTIONS = gql(/*GraphQL*/`
    query GetAccountsAndTransactions($userId: ID!) {
        plaidInstitutions(where: {hasPlaidItemWith: {hasOwnerWith: {id: $userId}}}) {
            edges {
                node {
                    id
                    name
                    accounts {
                        id
                        name
                        balanceAvailable
                        balanceCurrent
                        balanceIsoCurrencyCode
                    }
                }
            }
        }
        transactions(
            where: {
                hasInstitutionAccountWith: {
                    hasParentInstitutionWith: {
                        hasPlaidItemWith: {
                            hasOwnerWith: {id: $userId}
                        }
                    }
                }
            }
            orderBy: {field: DATE, direction: DESC}
        ) {
            edges {
                node {
                    amount
                    isoCurrencyCode
                    name
                    category
                    date
                }
            }
        }
    }
`);

export default function DashboardScreen() {
  const [userProfile] = useUserProfile();
  const accountsAndTransactionsQueryState = useQuery(GET_ACCOUNTS_AND_TRANSACTIONS, {
    variables: {
      userId: userProfile!.id,
    },
    refetchWritePolicy: "overwrite",
    initialFetchPolicy: "network-only",
    partialRefetch: true,
  });

  const [linkedInstitutions, transactions] = useMemo((): [Array<FinancialInstitutionItemType>, Array<TransactionItemType>] => {
    const accounts: FinancialInstitutionItemType[] = [];
    const transactions: TransactionItemType[] = [];

    if (queryUtils.isLoadingOrError(accountsAndTransactionsQueryState)) {
      return [accounts, transactions];
    }

    if (accountsAndTransactionsQueryState.data?.plaidInstitutions?.__typename === "PlaidInstitutionConnection") {
      for (const institution of accountsAndTransactionsQueryState.data.plaidInstitutions.edges || []) {
        if (institution?.node?.__typename !== "PlaidInstitution") {
          continue;
        }

        accounts.push({
          name: institution.node.name,
          accounts: (institution.node.accounts || []).map(account => ({
            name: account.name,
            id: account.id,
            balanceAvailable: account.balanceAvailable,
            balanceCurrent: account.balanceCurrent,
            balanceIsoCurrencyCode: account.balanceIsoCurrencyCode,
          }))
        });
      }
    }

    if (accountsAndTransactionsQueryState.data?.transactions.__typename === "TransactionConnection") {
      for (const transaction of accountsAndTransactionsQueryState.data.transactions.edges || []) {
        if (transaction?.node?.__typename !== "Transaction") {
          continue;
        }

        transactions.push({
          ...transaction.node,
          category: "",
        });
      }
    }

    return [accounts, transactions];
  }, [accountsAndTransactionsQueryState]);

  return (
    <AsyncOperationState
      operation={accountsAndTransactionsQueryState}
      component={PageBase}
      gap={5}
    >
      {linkedInstitutions.length ? (
        <LinkedItemsList institutions={linkedInstitutions} />
      ) : (
        <NotFoundPlaceholder>
          No linked bank accounts yet :(
        </NotFoundPlaceholder>
      )}

      {transactions.length ? (
        <>
          <Stack direction={{xs: "column", md: "row"}} gap={3} justifyContent="space-between" alignItems="center">
            <TransactionsInsightChartByField
              id="transactions-insights-by-category"
              title="Spent by category"
              field="category"
              transactions={transactions}
            />

            <TransactionsInsightChartByField
              id="transactions-insights-by-merchant"
              title="Spent by merchant"
              field="name"
              transactions={transactions}
            />
          </Stack>

          <TransactionsInsightsChartByDate
            id="transactions-insights-by-date"
            title="Spent by date"
            transactions={transactions}
            height={300}
          />

          <TransactionsTable
            transactions={transactions}
            sx={{
              height: 500,
            }}
          />
        </>
      ) : (
        <NotFoundPlaceholder>
          No information about transactions yet...
        </NotFoundPlaceholder>
      )}
    </AsyncOperationState>
  );
}

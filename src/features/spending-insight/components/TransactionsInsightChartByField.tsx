import groupBy from "lodash/groupBy";
import {blue, green, purple, red, yellow} from "@mui/material/colors";
import {darken} from "@mui/material/styles";
import last from "lodash/last";
import map from "lodash/map";
import orderBy from "lodash/orderBy";
import sumBy from "lodash/sumBy";
import {useMemo} from "react";
import Box from "@mui/material/Box";
import {Doughnut} from "react-chartjs-2";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import {TransactionItemType} from "../../../common/types";
import {TransactionInsightTitle} from "./common/TransactionInsightTitle";
import {Center} from "../../../common/components/layout/Center";

type Props = {
  id: string;
  title: string;
  field: keyof TransactionItemType;
  transactions: Array<TransactionItemType> | null | undefined;
}

const groupTransactionsByCategories = (transactions: Array<TransactionItemType>, key: keyof TransactionItemType): Array<{ key: string; value: number }> => {
  const normalisedTransactions = transactions.map(transaction => ({
    ...transaction,
    category: last(String(transaction[key]).split(",")),
  }));

  const groupedTransactions = groupBy(normalisedTransactions, key)
  const summarisedTransactions = Object.entries(groupedTransactions).map(([groupingKey, transactions]) => ({
    key: groupingKey,
    value: sumBy(transactions, "amount"),
  }));
  const ordered = orderBy(summarisedTransactions, (a) => Math.abs(a.value), "desc");

  return ordered.slice(0, Math.min(ordered.length, 5));
}

const colors = [
  darken(red[300], .1),
  darken(purple[300], .1),
  darken(yellow[300], .1),
  darken(blue[300], .1),
  darken(green[300], .1),
];

export function TransactionsInsightChartByField({id, title, field, transactions}: Props) {

  const [mostSpendingCategories, mostSpendingCategoriesList] = useMemo(() => {
    const data = {
      labels: [] as string[],
      datasets: [] as any[],
    };

    const transactionsData = groupTransactionsByCategories(
      transactions || [],
      field
    );

    data.labels = map(transactionsData, "key")
    data.datasets = [{
      label: "$ spend in category",
      data: map(transactionsData, "value"),
      backgroundColor: Array.from({length: 5}).map((_, i) => colors[i]),
      borderColor: Array.from({length: 5}).map((_, i) => colors[i])
    }];

    return [data, transactionsData];
  }, [transactions, field]);

  if (!transactions) {
    return null;
  }

  return (
    <Stack direction="column">
      <TransactionInsightTitle mb={1}>
        {title}
      </TransactionInsightTitle>

      <Center direction={{xs: "column", sm: "row"}} gap={2}>
        <Box position="relative" width={250} height={250}>
          <Doughnut id={id} data={mostSpendingCategories as any} />
        </Box>

        <Stack direction="column" gap={1}>
          {
            mostSpendingCategoriesList.map((item, i) => (
              <Stack key={item.key} direction="row" justifyContent="space-between" alignItems="center" gap={2}>
                <Tooltip title={item.key} placement="left">
                  <Box
                    sx={{
                      backgroundColor: colors[i],
                      borderRadius: 5,
                      padding: 1,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      maxWidth: 150,
                    }}
                  >
                    {item.key}
                  </Box>
                </Tooltip>

                <Typography variant="body2">
                  {item.value.toFixed(2)}
                </Typography>
              </Stack>
            ))
          }
        </Stack>
      </Center>
    </Stack>
  );
}

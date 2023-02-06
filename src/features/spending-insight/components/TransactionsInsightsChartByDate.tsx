import {TransactionItemType} from "../../../common/types";
import {Line} from "react-chartjs-2";
import {Center} from "../../../common/components/layout/Center";
import React, {ComponentProps, useMemo} from "react";
import startOfDay from "date-fns/startOfDay";
import startOfMonth from "date-fns/startOfMonth";
import format from "date-fns/format";
import groupBy from "lodash/groupBy";
import map from "lodash/map";
import orderBy from "lodash/orderBy";
import sumBy from "lodash/sumBy";
import {blue} from "@mui/material/colors";
import {alpha} from "@mui/material/styles";
import {TransactionInsightTitle} from "./common/TransactionInsightTitle";
import {parseTransactionDate} from "../utils";
import Stack from "@mui/material/Stack";

type Props = Pick<ComponentProps<typeof Stack>, "height"> & {
  id: string;
  title: string;
  transactions: TransactionItemType[] | undefined | null;
};

export function TransactionsInsightsChartByDate({id, title, transactions, ...props}: Props) {
  const [datedSpendingChartData] = useMemo(() => {
    const data = {
      labels: [] as string[],
      datasets: [] as any[],
    };

    if (!transactions?.length) {
      return [data];
    }

    const startOfToday = startOfDay(new Date());
    const cleanedFromNils = transactions.filter(v => v);
    const gropedByMonth = groupBy(cleanedFromNils, nodeHost => {
      const transactionDate = parseTransactionDate(nodeHost.date, startOfToday);

      return format(startOfMonth(transactionDate), "yyyy-MM-dd");
    });
    const monthToSpendingList = Object.entries(gropedByMonth).map(([date, transactions]) => ({
      date,
      amount: sumBy(map(transactions, transaction => Math.abs(transaction.amount))),
    }));
    const orderedMonthToSpendingList = orderBy(
      monthToSpendingList,
      nodeHost => {
        const transactionDate = parseTransactionDate(nodeHost.date, startOfToday);

        return transactionDate;
      },
      "asc",
    );

    data.labels = map(orderedMonthToSpendingList, "date");
    data.datasets = [{
      label: "Spent pet month",
      data: map(orderedMonthToSpendingList, "amount"),
      backgroundColor: alpha(blue["300"], 0.3),
      borderColor: blue["300"],
      fill: true,
    }];

    return [data]
  }, [transactions]);

  return (
    <Center
      direction="column"
      width="100%"
      {...props}
    >
      <TransactionInsightTitle mb={1}>
        {title}
      </TransactionInsightTitle>
      <Line
        id={id}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
              // position: 'top' as const,
            },
            tooltip: {
              intersect: false,
              mode: "x",
              position: "nearest",
            }
          },
        }}
        data={datedSpendingChartData}
      />
    </Center>
  );
}

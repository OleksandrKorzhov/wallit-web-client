import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import Chip from "@mui/material/Chip";
import {TransactionItemType} from "../../../common/types";
import {SxProps} from "@mui/material/styles";

type Props = {
  transactions: TransactionItemType[];
  sx?: SxProps;
};

/*@TODO: add sorting*/
export function TransactionsTable({transactions, sx}: Props) {
  return (
    <TableContainer sx={{flexGrow: 1, boxSizing: "border-box", height: "100%", ...sx}}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>Amount</TableCell>
            <TableCell>Currency</TableCell>
            <TableCell>Merchant</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            transactions.map((transaction, idx) => (
              <TableRow key={idx}>
                <TableCell>{transaction.amount}</TableCell>
                <TableCell>{transaction.isoCurrencyCode}</TableCell>
                <TableCell>{transaction.name}</TableCell>
                <TableCell>
                  {
                    transaction.category.split(",").map(category => (
                      <Chip
                        key={category}
                        clickable
                        size="small"
                        variant="outlined"
                        color="info"
                        label={category}
                        sx={{mr: 0.5, my: {xs: 0.5, md: 0}}}
                      />
                    ))
                  }
                </TableCell>
                <TableCell>{transaction.date}</TableCell>
              </TableRow>
            ))
          }
        </TableBody>
      </Table>
    </TableContainer>
  );
}

import Typography from "@mui/material/Typography";
import {ComponentProps, PropsWithChildren} from "react";

type Props = ComponentProps<typeof Typography> & {};

export function TransactionInsightTitle({children, ...props}: PropsWithChildren<Props>) {
  return (
    <Typography
      variant="body2"
      textTransform="uppercase"
      color="text.secondary"
      textAlign="center"
      {...props}
    >
      {children}
    </Typography>
  );
}

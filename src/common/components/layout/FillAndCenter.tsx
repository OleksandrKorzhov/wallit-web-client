import {ComponentProps, PropsWithChildren} from "react";
import {Fill} from "./Fill";
import Stack from "@mui/material/Stack";
import { SxProps } from "@mui/material";

type Props = {
  sx?: SxProps;
};

export function FillAndCenter({children, ...props}: PropsWithChildren<Props>) {
  return (
    <Fill component={Stack} justifyContent="center" alignItems="center" {...props}>
      {children}
    </Fill>
  );
}

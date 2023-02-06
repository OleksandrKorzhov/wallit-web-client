import { SxProps } from "@mui/material/styles";
import {ComponentProps, ComponentType, PropsWithChildren} from "react";
import Stack from "@mui/material/Stack";

type Props<T extends ComponentType> = ComponentProps<T> & {
  component?: T
  sx?: SxProps;
}

export function Center<T extends ComponentType = typeof Stack>({children, ...props}: PropsWithChildren<Props<T>>) {
  return (
    <Stack justifyContent="center" alignItems="center" {...props}>
      {children}
    </Stack>
  )
}

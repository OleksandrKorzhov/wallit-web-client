import React, {ComponentProps, PropsWithChildren} from "react";
import Box from "@mui/material/Box";
import {SxProps} from "@mui/material";

type Props<T extends React.ElementType> = ComponentProps<T> & {
  component?: T;
  sx?: SxProps;
};

export function Fill<T extends React.ElementType>({children, component, sx, ...props}: PropsWithChildren<Props<T>>) {
  return (
    <Box component={component} sx={{width: "100%", height: "100%", flexGrow: 1, ...sx}} {...props}>
      {children}
    </Box>
  );
}

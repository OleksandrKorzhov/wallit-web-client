import {ComponentProps, PropsWithChildren, useMemo} from "react";
import Stack from "@mui/material/Stack";
import {Fill} from "./Fill";
import useMediaQuery from "@mui/material/useMediaQuery";
import {useTheme} from "@mui/material/styles";

type Props = Pick<ComponentProps<typeof Stack>, "gap"> & {
  variant?: "single-page" | "standard"
};

export function PageBase({children, variant = "standard", ...props}: PropsWithChildren<Props>) {
  const theme = useTheme();
  const isTabletOrBigger = useMediaQuery(theme.breakpoints.up("sm"));
  const additionalProps = useMemo(() => {
    switch (variant) {
      case "standard": return {
        sx: {
          minHeight: "100%",
          height: "auto",
          flexGrow: 1,
        }
      };
      case "single-page": return {
        sx: {
          height: `calc(100vh - ${isTabletOrBigger ? '64' : '56'}px)`,
        },
      };
      default: return {};
    }
  }, [variant, isTabletOrBigger]);

  return (
    <Fill
      component={Stack}
      direction="column"
      p={2}
      {...additionalProps}
      {...props}
    >
      {children}
    </Fill>
  );
}

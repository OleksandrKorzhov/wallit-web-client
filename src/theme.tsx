import type {} from '@mui/lab/themeAugmentation';
import {createTheme} from "@mui/material/styles";
import {NavLink as RouterLink, NavLinkProps as RouterLinkProps} from "react-router-dom";
import React from "react";
import {LinkProps} from "@mui/material/Link";

const LinkBehaviour = React.forwardRef<HTMLAnchorElement, Omit<RouterLinkProps, 'to'> & {href: RouterLinkProps['to']}>((props, ref) => {
  const {href, ...other} = props;

  return <RouterLink ref={ref} to={href} {...other} />;
});

const textTheme = createTheme();

export const theme = createTheme(textTheme, {
  components: {
    MuiLink: {
      defaultProps: {
        component: LinkBehaviour,
      } as LinkProps,
      styleOverrides: {
        root: {
          color: textTheme.palette.text.primary,
        }
      }
    },

    MuiButtonBase: {
      defaultProps: {
        LinkComponent: LinkBehaviour,
      }
    }
  }
});

export type AppTheme = typeof theme;

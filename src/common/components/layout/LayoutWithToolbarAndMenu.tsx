import React, {PropsWithChildren, ReactElement, useState} from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationIcon from "@mui/icons-material/Notifications";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Badge from "@mui/material/Badge";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import AddCardIcon from "@mui/icons-material/AddCard";
import SettingsIcon from "@mui/icons-material/Settings";
import useMediaQuery from "@mui/material/useMediaQuery";
import {AppTheme} from "../../../theme";
import Drawer from "@mui/material/Drawer";
import {styled, useTheme} from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Link from "@mui/material/Link";
import config from "../../../config";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import Slide from "@mui/material/Slide";
import {useNotifications} from "../../../features/notifications/hooks/useNotifications";
import { pathUtils } from "../../utils";
import {useNavigate} from "react-router-dom";
import Button from "@mui/material/Button";
import {useAuth0} from "@auth0/auth0-react";

const DRAWER_WIDTH = 300;
const MOBILE_DRAWER_WIDTH = 300;

const BoxWithToolbarHeight = styled(Box)(({theme}) => ({
  ...theme.mixins.toolbar,
}));

const TopSpacer = (props: {in: boolean}) => {
  return (
    <Slide in={props.in} appear={false}>
      <BoxWithToolbarHeight />
    </Slide>
  );
}

const MenuListItem = ({icon, to, children}: PropsWithChildren<{ icon: ReactElement; to: string }>) => (
  <ListItem component={Link} href={to}>
    <ListItemButton>
      <ListItemIcon>
        {icon}
      </ListItemIcon>
      {children}
    </ListItemButton>
  </ListItem>
);

type Props = {}

export function LayoutWithToolbarAndDrawerMenu({children}: PropsWithChildren<Props>) {
  const {logout} = useAuth0();
  const navigate = useNavigate();
  const theme = useTheme<AppTheme>();
  const isTabletOrBigger = useMediaQuery(theme.breakpoints.up("md"));
  const isBigMobileOrBigger = useMediaQuery(theme.breakpoints.up("sm"));
  const isScrolled = useScrollTrigger();
  const [notifications] = useNotifications();

  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => () => {
    setDrawerOpen(state => !state);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
  }

  const handleNotificationsIconClick = () => {
    navigate(config.routing.notifications());
  }

  const renderMenuOptions = () => (
    <List onClick={closeDrawer}>
      <MenuListItem icon={<DashboardIcon/>} to={config.routing.dashboard()}>
        Dashboard
      </MenuListItem>

      <MenuListItem icon={<AddCardIcon/>} to={config.routing.linkBankAccount()}>
        Link bank account
      </MenuListItem>

      <MenuListItem icon={<LocalOfferIcon/>} to={pathUtils.templateToPath(config.routing.offers(), {id: ""})}>
        Offers
      </MenuListItem>

      <MenuListItem icon={<NotificationIcon/>} to={config.routing.notifications()}>
        Notifications
      </MenuListItem>

      <MenuListItem icon={<SettingsIcon/>} to={config.routing.settings()}>
        Settings
      </MenuListItem>
    </List>
  );

  const renderLogoutButton = () => {
    return (
      <Button
        variant="outlined"
        onClick={() => logout({logoutParams: {returnTo: window.location.origin}})}
        sx={{mx: 2, mb: 2, mt: "auto"}}
      >
        Logout
      </Button>
    )
  };

  return (
    <>
      <Slide in={!isScrolled} appear={false}>
        <AppBar position="fixed" sx={{zIndex: theme.zIndex.drawer + 1}}>
          <Toolbar>
            {isTabletOrBigger ? null : (
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="open drawer"
                onClick={toggleDrawer()}
              >
                <MenuIcon/>
              </IconButton>
            )}

            <Typography
              variant="subtitle1"
              mx="auto"
              sx={{
                ml: {xs: "auto", sm: 0},
                mr: {xs: "auto", sm: "auto"},
              }}
            >
              Wallit
            </Typography>

            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="open notifications"
              onClick={handleNotificationsIconClick}
            >
              <Badge badgeContent={notifications.length} color="error" showZero={false}>
                <NotificationIcon/>
              </Badge>
            </IconButton>
          </Toolbar>
        </AppBar>
      </Slide>

      {isTabletOrBigger ? (
        <Drawer
          variant="permanent"
          keepMounted
          open
          sx={{
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
          }}
          PaperProps={{
            sx: {width: DRAWER_WIDTH}
          }}
        >
          <TopSpacer in={!isScrolled} />

          {renderMenuOptions()}

          {renderLogoutButton()}
        </Drawer>
      ) : (
        <SwipeableDrawer
          anchor="left"
          open={drawerOpen}
          onOpen={toggleDrawer()}
          onClose={closeDrawer}
          disableBackdropTransition
          disableDiscovery
          disableSwipeToOpen={false}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            width: MOBILE_DRAWER_WIDTH
          }}
          PaperProps={{
            sx: {width: MOBILE_DRAWER_WIDTH}
          }}
        >
          <TopSpacer in={!isScrolled} />

          {renderMenuOptions()}

          {renderLogoutButton()}
        </SwipeableDrawer>
      )}

      <Stack
        direction="column"
        flexWrap="nowrap"
        sx={{
          marginLeft: isTabletOrBigger ? `${DRAWER_WIDTH}px` : 0,
          // width: "100%",
          // height: "100%",
          minHeight: "100vh",
          // flexGrow: 1,
        }}
      >
        <TopSpacer in={!isScrolled} />

        {/*@TODO: get toolbar height reliably!*/}
        <Container
          maxWidth="lg"
          // sx={{padding: 2, width: "100%", maxHeight: `calc(100% - ${isTabletOrBigger ? '64' : '56'}px)`, flexGrow: 1}}
          sx={{
            padding: 0,
            width: "100%",
            minHeight: `calc(100vh - ${isBigMobileOrBigger ? '64' : '56'}px)`,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {children}
        </Container>
      </Stack>
    </>
  );
}

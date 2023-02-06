import React from 'react';
import LinkBankAccountScreen from "./screens/link-bank-account/LinkBankAccountScreen";
import DashboardScreen from "./screens/dashboard/DashboardScreen";
import {createBrowserRouter, Navigate, Outlet, RouterProvider} from "react-router-dom";
import ErrorScreen from "./screens/error/ErrorScreen";
import RootAuthenticatedUserScreen from "./screens/root-authenticated-user/RootAuthenticatedUserScreen";
import config from "./config";
import {AccountDetailsScreen} from "./screens/accunt-defails/AccountDetailsScreen";
import {
  ArcElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip
} from 'chart.js';
import {SettingsScreen} from "./screens/settings/SettingsScreen";
import {NotificationsScreen} from "./screens/notifications/NotificationsScreen";
import {useNotificationsController} from "./features/notifications/hooks/useNotificationsController";
import {OffersScreen} from "./screens/offers/OffersScreen";
import {LayoutWithToolbarAndDrawerMenu} from "./common/components/layout/LayoutWithToolbarAndMenu";
import {LandingScreen} from "./screens/landing/LandingScreen";
import {OnboardingControlRouterWrapper} from "./features/onboarding/components/router/OnboardingControlRouterWrapper";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  ArcElement,
);

const WorkspaceWrapper = () => {
  useNotificationsController();

  return (
    <LayoutWithToolbarAndDrawerMenu>
      <Outlet/>
    </LayoutWithToolbarAndDrawerMenu>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingScreen/>,
  },
  {
    path: '/workspace',
    element: <RootAuthenticatedUserScreen/>,
    errorElement: <ErrorScreen/>,
    children: [
      {
        errorElement: <ErrorScreen/>,
        children: [
          {
            element: <OnboardingControlRouterWrapper/>,
            children: [
              {
                element: <WorkspaceWrapper/>,
                children: [
                  {
                    index: true,
                    element: <Navigate to={config.routing.dashboard()}/>,
                  },
                  {
                    path: config.routing.dashboard(),
                    element: <DashboardScreen/>,
                  },
                  {
                    path: config.routing.linkBankAccount(),
                    element: <LinkBankAccountScreen/>,
                  },
                  {
                    path: config.routing.accountDetails(),
                    element: <AccountDetailsScreen/>,
                  },
                  {
                    path: config.routing.settings(),
                    element: <SettingsScreen/>,
                  },
                  {
                    path: config.routing.notifications(),
                    element: <NotificationsScreen/>,
                  },
                  {
                    path: config.routing.offers(),
                    element: <OffersScreen/>,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  }
]);

function App() {
  return (
    <RouterProvider router={router}/>
  );
}

export default App;

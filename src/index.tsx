import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import './styles.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import CssBaseline from "@mui/material/CssBaseline";
import {ApolloClient, ApolloProvider, HttpLink, InMemoryCache, split} from "@apollo/client";
import config from "./config";
import {ThemeProvider} from "@mui/material";
import {theme} from "./theme";
import {SnackbarProvider} from "notistack";
import {SnackbarCloseButton} from "./features/snackbar/components/SnackbarCloseButton";
import {GraphQLWsLink} from "@apollo/client/link/subscriptions";
import {createClient, Client} from "graphql-ws";
import {getMainDefinition} from "@apollo/client/utilities";
import {Auth0Provider} from "@auth0/auth0-react";

const httpLink = new HttpLink({
  uri: config.server.graphQLUrl,
});

// Seems that the gqlgen lib supports the Apollo compatible subscription protocol https://github.com/99designs/gqlgen/blob/master/graphql/handler/transport/websocket.go#L92
// Just the server must be configured manually https://stackoverflow.com/a/75155517
const wsLink = new GraphQLWsLink(createClient({
  url: config.server.graphQLSubscriptionUrl,
  // retryAttempts: Infinity,
  // retryWait: () => new Promise(resolve => {
  //   setTimeout(resolve, 5000);
  // }),
  shouldRetry: (v) => {
    console.log("should retry:", v);

    return true;
  },
  on: {
    opened: (event: any) => {
      console.log("opened", event);
    },
    connecting: () => {
      console.log("connecting");
    },
    ping: (event: any) => {
      console.log("ping", event);
    },
    pong: (event: any) => {
      console.log("pong", event);
    },
    connected: (event: any) => {
      console.log("connected", event);
    },
    error: (event: any) => {
      console.log("error", event);
    },
    closed: (event: any) => {
      console.log("closed", event);
    },
  }
}));

// For fallback solution refer
// https://prog.world/react-apollo-gqlgen-websocket-the-complete-guide-part-2/
// const wsLink = new WebSocketLink({
//   uri: config.server.graphQLSubscriptionUrl,
//   options: {
//     reconnect: true,
//   },
// });

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

const apolloClient = new ApolloClient({
  // uri: config.server.graphQLUrl,
  link: splitLink,
  cache: new InMemoryCache(),
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <ApolloProvider client={apolloClient}>
        <CssBaseline/>
        <SnackbarProvider
          maxSnack={3}
          autoHideDuration={3000}
          action={SnackbarCloseButton}
        >
          {/*@TODO: move params to the configuration*/}
          <Auth0Provider
            domain="dev-uk7d5deeeyrhcpb2.us.auth0.com"
            clientId="UQTVW8j5R5SZdkun3QJr9z8RRLutExvJ"
            authorizationParams={{
              redirect_uri: window.location.origin + "/workspace"
            }}
          >
            <App />
          </Auth0Provider>
        </SnackbarProvider>
      </ApolloProvider>
    </ThemeProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

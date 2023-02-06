const serverConfig = () => ({
  graphQLUrl: process.env.REACT_APP_GRAPHQL_SERVER_URL as string,
  graphQLSubscriptionUrl: (process.env.REACT_APP_GRAPHQL_SERVER_URL || "").replace(/https?/, (match) => {
    switch (match.toLowerCase()) {
      case "https": return "wss";
      default:
        return "ws";
    }
  })
});

export default serverConfig;

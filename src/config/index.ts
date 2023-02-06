import serverConfig from "./server.config";
import routingConfig from "./routing.config";

const config = {
  server: serverConfig(),
  routing: routingConfig(),
}

export default config;

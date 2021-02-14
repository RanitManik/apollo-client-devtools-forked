import {
  initDevTools,
  writeData,
  handleReload,
  handleReloadComplete,
} from "../../application";
import {
  receiveGraphiQLRequests,
  sendResponseToGraphiQL,
} from "../../application/components/Explorer/graphiQLRelay";

(window as any).__DEVTOOLS_APPLICATION__ = {
  initialize: initDevTools,
  writeData,
  receiveGraphiQLRequests,
  sendResponseToGraphiQL,
  handleReload,
  handleReloadComplete,
};

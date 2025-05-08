import { Server } from "src/server";

(() => {
  bootstrap();
})();

async function bootstrap(): Promise<void> {
  const server = new Server();

  server.onListen();
  server.findRecords();
  server.start();
}

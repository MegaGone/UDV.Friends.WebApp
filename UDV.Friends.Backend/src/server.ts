import { CHANNEL, PORT } from "./config";
import { PostgresListener } from "./database";
import express, { Application } from "express";
import { Server as SocketIOServer } from "socket.io";
import { createServer, Server as HttpServer } from "http";

export class Server {
  private readonly _port: number;
  private readonly _channel: string;
  private readonly _app: Application;
  private _listener: PostgresListener;
  private readonly _server: HttpServer;
  private readonly _io: SocketIOServer;

  constructor() {
    this._port = +PORT;
    this._app = express();
    this._channel = CHANNEL;
    this._server = createServer(this._app);
    this._listener = new PostgresListener();

    this._io = new SocketIOServer(this._server, {
      cors: {
        origin: "*",
      },
    });
  }

  public onListen() {
    this._listener.listen(this._channel, (payload) => {
      console.log("[INFO][LISTENER][CHANGE]:", payload);

      this._io.emit(this._channel, payload);
    });
  }

  public start(): void {
    this._server.listen(this._port, () => {
      console.log(`[INFO][SERVER][RUNNING] http://localhost:${this._port}`);
    });
  }
}

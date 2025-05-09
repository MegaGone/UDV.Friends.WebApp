import { CHANNEL, PORT } from "./config";
import express, { Application } from "express";
import { Server as SocketIOServer } from "socket.io";
import { createServer, Server as HttpServer } from "http";
import { FriendEntity, PostgresDatasource, PostgresListener } from "./database";

export class Server {
  private readonly _port: number;
  private readonly _channel: string;
  private readonly _app: Application;
  private _listener: PostgresListener;
  private readonly _server: HttpServer;
  private readonly _io: SocketIOServer;
  private _datasource!: PostgresDatasource;

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

    this._initConnection();
  }

  private async _initConnection(): Promise<void> {
    this._datasource = new PostgresDatasource();
    await this._datasource.connect();
  }

  public onListen() {
    this._listener.listen(this._channel, (payload) => {
      console.log("[INFO][LISTENER][CHANGE]:", payload);

      this._io.emit(this._channel, payload);
    });
  }

  public findRecords() {
    this._io.on("connection", (socket) => {
      console.log("[INFO][SOCKET] New client connected");

      socket.on("get_friends", async ({ page = 1, limit = 10 }) => {
        const offset = (page - 1) * limit;

        const { rows, count } = await FriendEntity.findAndCountAll({
          limit,
          offset,
          order: [["id", "ASC"]],
        });

        socket.emit("friends_page", {
          total: count,
          page,
          limit,
          data: rows,
        });
      });
    });
  }

  public start(): void {
    this._server.listen(this._port, () => {
      console.log(`[INFO][SERVER][RUNNING] http://localhost:${this._port}`);
    });
  }
}

import { Client } from "pg";
import { DB_DATABASE, DB_HOST, DB_PASSWORD, DB_PORT, DB_USER } from "src/config";

export class PostgresListener {
  private readonly _client: Client;

  constructor() {
    this._client = new Client({
      host: DB_HOST,
      user: DB_USER,
      port: +DB_PORT,
      database: DB_DATABASE,
      password: DB_PASSWORD,
    });
  }

  public async listen(channel: string, callback: (payload: unknown) => void): Promise<void> {
    await this._client.connect();
    await this._client.query(`LISTEN ${channel}`);

    this._client.on("notification", (msg) => {
      if (!msg || !msg?.payload || msg?.channel !== channel) return;

      const payload = JSON.parse(msg.payload);
      callback(payload);
    });

    console.log(`[INFO][POSTGRES][LISTENER] Listening on channel "${channel}"`);
  }
}

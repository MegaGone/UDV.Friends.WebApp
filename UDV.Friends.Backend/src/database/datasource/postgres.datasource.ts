import { FriendEntity } from "../entities";
import { Options, Sequelize } from "sequelize";
import { DB_DATABASE, DB_PASSWORD, DB_USER, DB_HOST, DB_PORT, DB_LOGGING } from "src/config";

export class PostgresDatasource {
  public client: Sequelize;

  constructor() {
    const options: Options = {
      host: DB_HOST,
      port: +DB_PORT,
      username: DB_USER,
      dialect: "postgres",
      database: DB_DATABASE,
      password: DB_PASSWORD,
      logging: DB_LOGGING === "true",
    };

    this.client = new Sequelize(options);
  }

  public async connect() {
    try {
      FriendEntity.initialize(this.client);
      await this.client.authenticate();

      console.log("[INFO][POSTGRES][CONNECT] Successfully connected to the database");
    } catch (error) {
      console.error("[ERROR][POSTGRES][CONNECT]", error);
    }
  }
}

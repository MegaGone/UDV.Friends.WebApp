import { DataTypes, Model, Sequelize } from "sequelize";

export class FriendEntity extends Model {
  public id!: number;
  public name!: string;
  public gender!: string;

  public static initialize(sequelize: Sequelize): void {
    FriendEntity.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        gender: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        created_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal("NOW()"),
        },
        updated_at: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal("NOW()"),
        },
      },
      {
        sequelize,
        tableName: "my_friends",
        timestamps: false,
      },
    );
  }
}

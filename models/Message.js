import {Model, DataTypes} from "sequelize";
import Database from "../controllers/databaseController.js";
import User from "./User.js";

export default class Message extends Model {}

Message.init({
    uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: User,
            key: 'uuid'
        }
    },
    content: {
        type: DataTypes.STRING(1024),
    },
    read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    images: {
        type: DataTypes.JSON,
        allowNull: true,
    }
}, {
    sequelize: Database.getCon(),
    collate: "utf8mb4_unicode_ci",
    tableName: "messages"
});

Message.belongsTo(User, {foreignKey: 'uuid'});

(async () => {
    await Message.sync();
})();

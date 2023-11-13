import { Model, DataTypes, Sequelize } from "sequelize";
import Database from "../controllers/databaseController.js";

class User extends Model {

}
Database.startDatabase();

User.init({
    uuid: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING(128),
        allowNull: false,
        unique: true
    }, 
    password: {
        type: DataTypes.STRING(64),
        allowNull: false
    },
    profilePicture: {
        type: DataTypes.TEXT,
        defaultValue: "default-user.png"
    },
    emailVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    rank: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        comment: "0 = user | 1 = moderator | 2 = administrator"
    },
    certified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    }
}, {
    sequelize: Database.getCon(),
    tableName: "users"
});

(async () => {
    await User.sync();
})();

export default User;
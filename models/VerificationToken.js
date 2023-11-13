import { Model, DataTypes, Sequelize } from "sequelize";
import Database from "../controllers/databaseController.js";
import User from "./User.js";

class VerificationToken extends Model {

}

Database.startDatabase();

VerificationToken.init({
    uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: true,
        references: {
            model: User,
            key: 'uuid'
        }
    },
    token: {
        type: DataTypes.STRING, // Le type de données dépend de votre application
        allowNull: false,
        unique: true
    }
}, {
    sequelize: Database.getCon(),
    tableName: "verification_tokens"
});

(async () => {
    await VerificationToken.sync();
})();

export default VerificationToken;

import {DataTypes, Model} from "sequelize";
import Database from "../controllers/databaseController.js";
import User from './User.js';

class UserProfile extends Model {}

Model.init({
    uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: User,
            key: 'uuid'
        }        
    },
    displayname: {
        type: DataTypes.STRING(20),
        allowNull: true,
    },
    profilePicture: {
        type: DataTypes.BLOB('long'),
        allowNull: true,
        defaultValue: null
    },
    onlineStatus: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    status: {
        type: DataTypes.STRING(255),
        allowNull: true,
        defaultValue: ""
    },
    description: {
        type: DataTypes.BLOB('long'),
        allowNull: true,
    }
}, {
    sequelize: Database.getCon(),
    tableName: "userprofiles",
    collate: "utf8mb4_unicode_ci"
});


User.hasOne(UserProfile, {foreignKey: "uuid"});

(async () => {
    await UserProfile.sync();
})();

export default UserProfile;


